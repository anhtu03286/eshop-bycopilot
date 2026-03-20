# Fashion E-commerce Monorepo

Fullstack e-commerce system with three apps:

- backend: Node.js REST API (Express + Prisma + PostgreSQL)
- frontend: customer storefront (Next.js)
- admin: separate admin panel (React + Vite)

## Repository structure

- backend
- frontend
- admin
- docs
- docker-compose.yml
- docker-compose.backend.yml
- docker-compose.frontend.yml

## Prerequisites

- Node.js 20+
- npm 10+
- Docker Desktop (for containerized development)

## Environment setup

Backend env:

1. Copy backend/.env.example to backend/.env
2. Set required values (database URL, JWT secrets, Stripe keys)

Admin env:

1. Copy admin/.env.example to admin/.env
2. Ensure VITE_API_BASE_URL points to backend API, default:
   http://localhost:3000/api/v1

## Run with Docker (recommended)

Start full stack (database + backend + storefront):

```bash
docker compose up --build
```

Services:

- Storefront: http://localhost:5173
- Backend API: http://localhost:3000/api/v1
- PostgreSQL: localhost:5432

Admin app runs separately (outside compose):

```bash
cd admin
npm install
npm run dev
```

Admin URL:

- http://localhost:5174

## CORS setup for admin + storefront

For backend, configure:

- CLIENT_ORIGIN=http://localhost:5173
- ADMIN_ORIGIN=http://localhost:5174

These are already wired in docker-compose backend service environment.

## Local run without Docker

Backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Admin:

```bash
cd admin
npm install
npm run dev
```

## Useful docs

- docs/backend-api.md
- docs/docker-development.md
- docs/docker-production.md
- docs/frontend-architecture.md

## Default admin seed account

- Email: admin@fashion.local
- Password: AdminPass123!

Use only for local development and rotate credentials in real environments.
