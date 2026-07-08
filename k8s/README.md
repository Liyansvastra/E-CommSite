# Kubernetes Manifests

These manifests are optional deployment references for a Kubernetes cluster.

They run:

- `liyans-vastra-backend` with 2 replicas
- `liyans-vastra-frontend` with 2 replicas

Before applying:

1. Build and push Docker images.
2. Replace `ghcr.io/your-org/...` image names.
3. Copy `backend-secret.example.yaml` to a private secret file and add real values.
4. Do not commit real API keys.

Apply:

```bash
kubectl apply -f k8s/backend-secret.example.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```
