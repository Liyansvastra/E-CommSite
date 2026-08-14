# LIYAN'S VASTRA Backend

Standalone FastAPI backend for website contact enquiries.

## Run Locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m uvicorn main:app --reload
```

API runs at `http://localhost:8000`.

## Endpoints

- `GET /health`
- `POST /api/contact/send-email`

## Contact Payload

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "subject": "Custom T-shirt enquiry",
  "message": "I want to know about logo T-shirt styles."
}
```

## Email Provider

The contact form sends email through your own SMTP server.

```env
CONTACT_TO_EMAIL=info@liyansvastra.com
SMTP_HOST=server147.nethost.in
SMTP_FALLBACK_HOSTS=server147.nethost.in
SMTP_PORT=465
SMTP_USERNAME=info@liyansvastra.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=info@liyansvastra.com
```

All email credentials must stay in backend environment variables only. Do not add them to the frontend.
