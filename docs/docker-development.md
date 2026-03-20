# Docker Development Guide

This project uses Docker Compose to run:
- frontend (Next.js)
- backend (Node.js REST API)
- database (PostgreSQL)

## Files

- `docker-compose.yml` - full development stack with profiles
- `docker-compose.backend.yml` - backend + database only
- `docker-compose.frontend.yml` - frontend only
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `backend/.dockerignore`
- `frontend/.dockerignore`

## Development workflow

Source code is mounted into containers using bind volumes, so code edits on your host are reflected immediately.
Hot reload is enabled by:
- backend: `nodemon` via `npm run dev:docker`
- frontend: Next dev server via `npm run dev:docker`

No image rebuild is needed for normal source-code changes.

Dependency install behavior:
- Docker image build uses `npm ci` for reproducible and cache-friendly installs.
- Container startup runs a conditional `npm ci` only when `node_modules` volume is empty.
- This avoids re-installing dependencies on every container restart.

Database bootstrap behavior (backend service):
- Runs `prisma generate` on startup.
- Runs `prisma db push` to ensure tables exist in development.
- Runs `npm run prisma:seed` to add initial admin and sample products (idempotent).

## Prerequisites

1. Ensure `backend/.env` exists (copy from `backend/.env.example`).
2. Make sure Docker Desktop is running.

## Run commands

### Run full stack

```bash
docker compose up --build
```

Services:
- frontend: http://localhost:5173
- backend: http://localhost:3000
- postgres: localhost:5432

### Run backend + database only

```bash
docker compose -f docker-compose.backend.yml up --build
```

### Run frontend only

```bash
docker compose -f docker-compose.frontend.yml up --build
```

If frontend runs separately from backend, set:
- `NEXT_PUBLIC_API_BASE_URL` to the backend public URL.

## Useful operations

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers with volumes
docker compose down -v

# Rebuild images after dependency changes
docker compose build --no-cache
```

## Production note

These compose files are optimized for development.
For production, build immutable images and run `npm run build` + `npm run start` for frontend/backend, without source bind mounts.
Keep secrets in environment variables or a secret manager, never hardcoded.

For production build and manual Docker Hub push steps, see `docs/docker-production.md`.
