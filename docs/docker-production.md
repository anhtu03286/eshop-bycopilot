# Docker Production Guide

This guide describes how to build small immutable production images and manually push them to Docker Hub.

## Production Dockerfiles

- backend: `backend/Dockerfile.prod`
- frontend: `frontend/Dockerfile.prod`

Both use multi-stage builds with `node:20-slim` and `npm ci` for reproducible installs.

## Build commands

From repository root:

```bash
docker build -f backend/Dockerfile.prod -t fashion-backend:prod ./backend
docker build -f frontend/Dockerfile.prod -t fashion-frontend:prod ./frontend
```

## Smoke test locally

Backend:

```bash
docker run --rm -p 3000:3000 --env-file backend/.env fashion-backend:prod
```

Frontend:

```bash
docker run --rm -p 5173:5173 -e NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1 fashion-frontend:prod
```

## Manual Docker Hub push

1. Login:

```bash
docker login
```

2. Tag images (replace `<dockerhub-user>` and `<tag>`):

```bash
docker tag fashion-backend:prod <dockerhub-user>/fashion-backend:<tag>
docker tag fashion-frontend:prod <dockerhub-user>/fashion-frontend:<tag>
```

3. Push:

```bash
docker push <dockerhub-user>/fashion-backend:<tag>
docker push <dockerhub-user>/fashion-frontend:<tag>
```

## Suggested manual tags

Use one of these patterns:

- semantic version: `v1.0.0`
- date release: `2026-03-20`
- git short SHA: `sha-<shortsha>`

## Notes

- Development compose files remain optimized for local hot reload.
- Production images should run without source bind mounts.
- Keep runtime secrets in environment variables (never hardcode secrets in Dockerfiles).
