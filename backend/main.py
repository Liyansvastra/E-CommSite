import os
import re
import json
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage
from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI, Header
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator


def _load_local_env() -> None:
    env_path = Path(__file__).with_name(".env")
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def _split_origins(value: str) -> List[str]:
    return [origin.strip() for origin in value.split(",") if origin.strip()]


_load_local_env()

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://e-comm-site-xi.vercel.app",
    "https://liyansvastra.github.io",
]

ALLOWED_ORIGINS = list(
    dict.fromkeys(_split_origins(os.getenv("ALLOWED_ORIGINS", "")) + DEFAULT_ALLOWED_ORIGINS)
)

app = FastAPI(
    title="LIYAN'S VASTRA Contact API",
    version="1.0.0",
    description="Backend email API for LIYAN'S VASTRA brand showcase enquiries.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, __):
    return JSONResponse(
        status_code=400,
        content={
            "ok": False,
            "message": "Please check the form details and try again.",
        },
    )


class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    email: str = Field(..., min_length=5, max_length=254)
    subject: str = Field(..., min_length=3, max_length=120)
    message: str = Field(..., min_length=10, max_length=2000)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip()
        if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", value):
            raise ValueError("Invalid email address.")
        return value


class AdminContentPayload(BaseModel):
    content: Dict[str, Any]


def _clean(value: str) -> str:
    value = re.sub(r"[\r\n]+", " ", value)
    return value.strip()


def _smtp_configured() -> bool:
    required = [
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USERNAME",
        "SMTP_PASSWORD",
        "SMTP_FROM_EMAIL",
        "CONTACT_TO_EMAIL",
    ]
    return all(os.getenv(key) for key in required)


def _resend_configured() -> bool:
    required = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "CONTACT_TO_EMAIL"]
    return all(os.getenv(key) for key in required)


def _email_text(payload: ContactMessage) -> str:
    safe_name = _clean(payload.name)
    safe_subject = _clean(payload.subject)
    return "\n".join(
        [
            "New enquiry from LIYAN'S VASTRA website",
            "",
            f"Name: {safe_name}",
            f"Email: {payload.email}",
            f"Subject: {safe_subject}",
            "",
            "Message:",
            payload.message.strip(),
        ]
    )


def _send_with_resend(payload: ContactMessage) -> None:
    api_key = os.environ["RESEND_API_KEY"]
    resend_from = os.environ["RESEND_FROM_EMAIL"]
    contact_to = os.environ["CONTACT_TO_EMAIL"]
    safe_subject = _clean(payload.subject)
    body = {
        "from": resend_from,
        "to": [contact_to],
        "reply_to": str(payload.email),
        "subject": f"LIYAN'S VASTRA enquiry: {safe_subject}",
        "text": _email_text(payload),
    }
    request = urllib.request.Request(
        "https://api.resend.com/emails",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "User-Agent": "liyans-vastra-contact-api/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            if response.status >= 300:
                raise RuntimeError("Resend API rejected the message.")
    except urllib.error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"Resend API error: {details}") from exc


def _send_with_smtp(payload: ContactMessage) -> None:
    smtp_host = os.environ["SMTP_HOST"]
    smtp_port = int(os.environ["SMTP_PORT"])
    smtp_username = os.environ["SMTP_USERNAME"]
    smtp_password = os.environ["SMTP_PASSWORD"]
    smtp_from = os.environ["SMTP_FROM_EMAIL"]
    contact_to = os.environ["CONTACT_TO_EMAIL"]
    safe_subject = _clean(payload.subject)

    email = EmailMessage()
    email["From"] = smtp_from
    email["To"] = contact_to
    email["Reply-To"] = str(payload.email)
    email["Subject"] = f"LIYAN'S VASTRA enquiry: {safe_subject}"
    email.set_content(_email_text(payload))

    with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(email)


def _send_email(payload: ContactMessage) -> None:
    if _resend_configured():
        _send_with_resend(payload)
        return
    if _smtp_configured():
        _send_with_smtp(payload)
        return
    raise RuntimeError("Email settings are not configured.")


def _email_provider_name() -> str:
    if _resend_configured():
        return "resend"
    if _smtp_configured():
        return "smtp"
    return "not-configured"


def _supabase_configured() -> bool:
    return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_ROLE_KEY"))


def _supabase_headers(extra: Dict[str, str] | None = None) -> Dict[str, str]:
    key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "User-Agent": "liyans-vastra-admin-api/1.0",
    }
    if extra:
        headers.update(extra)
    return headers


def _supabase_request(path: str, method: str = "GET", body: Any | None = None, extra_headers: Dict[str, str] | None = None) -> Any:
    base_url = os.environ["SUPABASE_URL"].rstrip("/")
    data = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/rest/v1/{path}",
        data=data,
        headers=_supabase_headers(extra_headers),
        method=method,
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        raw = response.read().decode("utf-8", errors="ignore")
        if not raw:
            return None
        return json.loads(raw)


def _admin_authorized(email: str | None, password: str | None) -> bool:
    expected_email = os.getenv("ADMIN_EMAIL", "liyansvastra@brillaris.pro")
    expected_password = os.getenv("ADMIN_PASSWORD", "Brillaris$12")
    return email == expected_email and password == expected_password


def _as_list(value: Any) -> List[Any]:
    return value if isinstance(value, list) else []


def _style_item(item: Any, category: Dict[str, Any], index: int) -> Dict[str, Any]:
    if isinstance(item, dict):
        title = item.get("title") or f"Style {index + 1}"
        return {
            "id": item.get("id") or f"{category.get('id', 'category')}-{index}",
            "title": title,
            "text": item.get("text") or category.get("text") or "",
            "frontImage": item.get("frontImage") or category.get("frontImage") or "",
            "backImage": item.get("backImage") or category.get("backImage") or "",
            "clothStyle": item.get("clothStyle") or "",
            "fabric": item.get("fabric") or "",
            "fit": item.get("fit") or "",
            "rating": item.get("rating") or "",
            "rate": item.get("rate") or category.get("rate") or "",
        }
    title = str(item or f"Style {index + 1}")
    return {
        "id": f"{category.get('id', 'category')}-{index}",
        "title": title,
        "text": category.get("text") or "",
        "frontImage": category.get("frontImage") or "",
        "backImage": category.get("backImage") or "",
        "clothStyle": "",
        "fabric": "",
        "fit": "",
        "rating": "",
        "rate": category.get("rate") or "",
    }


def _page_rows(content: Dict[str, Any]) -> List[Dict[str, Any]]:
    site = content.get("site") if isinstance(content.get("site"), dict) else {}
    return [
        {
            "page_key": "home",
            "page_name": "Home",
            "title": site.get("heroTitle", ""),
            "subtitle": site.get("heroText", ""),
            "body": {
                "storyTitle": site.get("storyTitle", ""),
                "storyParagraphs": _as_list(site.get("storyParagraphs")),
            },
        },
        {
            "page_key": "about",
            "page_name": "About",
            "title": "About LIYAN'S VASTRA",
            "subtitle": site.get("aboutSubtitle", ""),
            "body": {
                "journey": _as_list(site.get("aboutJourney")),
            },
        },
        {
            "page_key": "services",
            "page_name": "Services",
            "title": "Our Services",
            "subtitle": "T-shirt style categories and custom apparel groups.",
            "body": {
                "categoryCount": len(_as_list(content.get("categories"))),
            },
        },
        {
            "page_key": "contact",
            "page_name": "Contact",
            "title": site.get("contactTitle", ""),
            "subtitle": site.get("contactSubtitle", ""),
            "body": {},
        },
    ]


def _image_rows(content: Dict[str, Any]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for category_index, category in enumerate(_as_list(content.get("categories"))):
        if not isinstance(category, dict):
            continue
        category_id = category.get("id") or f"category-{category_index}"
        category_name = category.get("title") or f"Category {category_index + 1}"
        brand_name = category.get("badge") or ""
        rows.append(
            {
                "id": category_id,
                "category_id": category_id,
                "category_name": category_name,
                "group_key": "category",
                "group_name": "Category Card",
                "name": category_name,
                "brand_name": brand_name,
                "description": category.get("text") or "",
                "cloth_style": category.get("clothStyle") or "",
                "fabric": category.get("fabric") or "",
                "fit": category.get("fit") or "",
                "rating": category.get("rating") or "",
                "rate": category.get("rate") or "",
                "front_image": category.get("frontImage") or "",
                "back_image": category.get("backImage") or "",
                "show_on_home": category.get("showOnHome", True) is not False,
                "show_on_services": category.get("showOnServices", True) is not False,
                "sort_order": category_index,
            }
        )
        for item_index, item in enumerate(_as_list(category.get("items"))):
            style = _style_item(item, category, item_index)
            rows.append(
                {
                    "id": f"{category_id}:{style['id']}",
                    "category_id": category_id,
                    "category_name": category_name,
                    "group_key": style["id"],
                    "group_name": style["title"],
                    "name": style["title"],
                    "brand_name": brand_name,
                    "description": style["text"],
                    "cloth_style": style["clothStyle"],
                    "fabric": style["fabric"],
                    "fit": style["fit"],
                    "rating": style["rating"],
                    "rate": style["rate"],
                    "front_image": style["frontImage"],
                    "back_image": style["backImage"],
                    "show_on_home": False,
                    "show_on_services": True,
                    "sort_order": item_index,
                }
            )
    return rows


def _next_edit_label() -> str:
    try:
        rows = _supabase_request("site_content_backup?select=id", method="GET")
        count = len(rows or [])
    except Exception:
        count = 0
    return f"edit-{count + 1}"


def _replace_current_table(table: str, rows: List[Dict[str, Any]]) -> None:
    key = "page_key" if table == "site_pages_current" else "id"
    _supabase_request(f"{table}?{key}=not.is.null", method="DELETE", extra_headers={"Prefer": "return=minimal"})
    if rows:
        _supabase_request(
            table,
            method="POST",
            body=rows,
            extra_headers={"Prefer": "resolution=merge-duplicates,return=minimal"},
        )


def _sync_structured_tables(content: Dict[str, Any], edit_label: str) -> None:
    pages = _page_rows(content)
    images = _image_rows(content)
    _replace_current_table("site_pages_current", pages)
    _replace_current_table("image_containers_current", images)
    _supabase_request(
        "site_pages_mirror",
        method="POST",
        body=[{"edit_label": edit_label, **row} for row in pages],
        extra_headers={"Prefer": "return=minimal"},
    )
    _supabase_request(
        "image_containers_mirror",
        method="POST",
        body=[{"edit_label": edit_label, "container_id": row["id"], **{key: value for key, value in row.items() if key != "id"}} for row in images],
        extra_headers={"Prefer": "return=minimal"},
    )


def _store_contact_message(payload: ContactMessage, status: str, provider: str, error_message: str = "") -> None:
    if not _supabase_configured():
        return
    row = [
        {
            "name": _clean(payload.name),
            "email": payload.email.strip(),
            "subject": _clean(payload.subject),
            "message": payload.message.strip(),
            "status": status,
            "provider": provider,
            "error_message": error_message[:500] if error_message else "",
        }
    ]
    _supabase_request(
        "contact_email_messages",
        method="POST",
        body=row,
        extra_headers={"Prefer": "return=minimal"},
    )


@app.get("/health")
def health():
    return {"ok": True, "service": "LIYAN'S VASTRA Contact API"}


@app.post("/api/contact/send-email")
def send_contact_email(payload: ContactMessage):
    provider = _email_provider_name()
    try:
        _send_email(payload)
        _store_contact_message(payload, "sent", provider)
    except Exception as exc:
        try:
            _store_contact_message(payload, "failed", provider, str(exc))
        except Exception:
            pass
        return {
            "ok": False,
            "message": "Please check the form details and try again.",
        }

    return {
        "ok": True,
        "message": "Message sent successfully.",
    }


@app.get("/api/admin/content")
def get_admin_content():
    if not _supabase_configured():
        return {
            "ok": False,
            "content": None,
            "message": "Supabase is not configured.",
        }
    try:
        rows = _supabase_request("site_content_current?select=content&id=eq.main&limit=1")
    except Exception:
        return {
            "ok": False,
            "content": None,
            "message": "Unable to load website content.",
        }
    content = rows[0]["content"] if rows else None
    return {
        "ok": True,
        "content": content,
        "message": "Website content loaded.",
    }


@app.put("/api/admin/content")
def save_admin_content(
    payload: AdminContentPayload,
    x_admin_email: str | None = Header(default=None),
    x_admin_password: str | None = Header(default=None),
):
    if not _admin_authorized(x_admin_email, x_admin_password):
        return {
            "ok": False,
            "message": "Admin access denied.",
        }
    if not _supabase_configured():
        return {
            "ok": False,
            "message": "Supabase is not configured.",
        }
    try:
        edit_label = _next_edit_label()
        current_row = [{"id": "main", "content": payload.content}]
        _supabase_request(
            "site_content_current",
            method="POST",
            body=current_row,
            extra_headers={"Prefer": "resolution=merge-duplicates,return=minimal"},
        )
        _sync_structured_tables(payload.content, edit_label)
        backup_row = [{"source_id": "main", "action": edit_label, "content": payload.content}]
        _supabase_request(
            "site_content_backup",
            method="POST",
            body=backup_row,
            extra_headers={"Prefer": "return=minimal"},
        )
    except Exception:
        return {
            "ok": False,
            "message": "Unable to save website content.",
        }
    return {
        "ok": True,
        "message": "Website content saved and structured backup snapshot created.",
    }
