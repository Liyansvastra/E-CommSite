import os
import re
import json
import smtplib
import urllib.error
import urllib.request
from email.message import EmailMessage
from pathlib import Path
from typing import List

from fastapi import FastAPI
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


@app.get("/health")
def health():
    return {"ok": True, "service": "LIYAN'S VASTRA Contact API"}


@app.post("/api/contact/send-email")
def send_contact_email(payload: ContactMessage):
    try:
        _send_email(payload)
    except Exception:
        return {
            "ok": False,
            "message": "Please check the form details and try again.",
        }

    return {
        "ok": True,
        "message": "Message sent successfully.",
    }
