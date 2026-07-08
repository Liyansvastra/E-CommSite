# Deployment Guide

## Backend on Render

Render can deploy the backend from `render.yaml`.

1. Push the repository to GitHub.
2. In Render, create a Blueprint from the repository.
3. Set `RESEND_API_KEY` in Render environment variables.
4. Keep `RESEND_FROM_EMAIL` as `LIYAN'S VASTRA <onboarding@resend.dev>` for testing.
5. After verifying a domain in Resend, change `RESEND_FROM_EMAIL` to the verified sender.
6. Confirm `/health` returns OK.

Render environment variables protect secrets and should be configured in the dashboard or Blueprint secret fields.

## Frontend on Vercel

Use the `frontend` folder as the Vercel project root.

Set this Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

Then deploy through Vercel Git integration. `frontend/vercel.json` configures the Vite build and SPA fallback.

If the Vercel project root is the repository root instead, keep the root `vercel.json` settings:

- Install Command: `npm --prefix frontend ci --no-audit --no-fund`
- Build Command: `npm --prefix frontend run build`
- Output Directory: `frontend/dist`

## Docker Local Run

Create `backend/.env` with real email values, then run:

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:8000`

## Kubernetes

Kubernetes manifests are in `k8s/` and use 2 replicas for frontend and backend. Replace image names and provide secrets before applying.

## Quality Tools Added

- `.editorconfig` for consistent editor formatting
- `.prettierrc` for frontend formatting rules
- Dockerfiles for reproducible containers
- Render Blueprint for backend deployment
- Vercel config for frontend deployment
- Kubernetes manifests with readiness/liveness probes
