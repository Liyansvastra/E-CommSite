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

Recommended simple setup: Resend.

```env
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=LIYAN'S VASTRA <onboarding@resend.dev>
CONTACT_TO_EMAIL=liyansvastra@gmail.com
```

For production, replace `onboarding@resend.dev` with a sender from a verified Resend domain.

SMTP is still supported as a fallback if Resend variables are not configured. All email credentials must stay in backend environment variables only. Do not add them to the frontend.
