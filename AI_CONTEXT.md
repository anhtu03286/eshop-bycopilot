# AI_CONTEXT

## Project Snapshot

This repository is a fullstack fashion ecommerce project with three active parts:

- `backend/` - Node.js REST API (Express + TypeScript + Prisma + PostgreSQL + Stripe)
- `frontend/` - Next.js App Router web app (TypeScript + Tailwind + Redux Toolkit)
- Docker orchestration at repository root for local development and split deployments

Auxiliary folders like `gstack/`, `infra/`, and `docs/` are present; `gstack/` is tooling-related and separate from the ecommerce runtime.

## High-Level Architecture

### Backend architecture

- Runtime: Node.js + Express + TypeScript
- Persistence: PostgreSQL via Prisma ORM
- Security: JWT access token + refresh token flow, auth middleware, role checks
- Payments: Stripe Checkout session endpoint + webhook handler
- API style: REST under `/api/v1`

Core backend domains:

- Auth: register, login, refresh, logout, current user
- Products: catalog listing/detail and admin CRUD
- Cart: active cart and item mutations
- Orders: create from cart, list, get detail
- Payments: checkout session and webhook processing

### Frontend architecture

- Framework: Next.js App Router + TypeScript
- Styling: TailwindCSS
- State: Redux Toolkit store with modular slices
- Data access: centralized Axios API client + domain services
- Route protection: client auth/admin guards
- Payments UX: create order, request checkout session, redirect to Stripe

Frontend route groups:

- Public: home, product listing, product detail, categories, search
- User: login, register, profile, order history
- Shopping: cart, checkout, Stripe payment step, order confirmation
- Admin: login, product management, order management, user management

Reusable UI/component system includes:

- Layout: top navigation + footer
- Commerce: ProductCard, ProductGrid, CartItem, CheckoutForm, OrderSummary
- Admin: AdminSidebar, AdminTable

## API Integration Contract

Backend base path:

- `/api/v1`

Primary consumed endpoints:

- Auth: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- Products: `GET /products`, `GET /products/:slug`, admin `POST/PUT/DELETE /products...`
- Cart: `GET /cart`, `POST /cart/items`, `PUT /cart/items`, `DELETE /cart/items/:productId`
- Orders: `POST /orders`, `GET /orders`, `GET /orders/:orderId`
- Payments: `POST /payments/checkout-session`, `POST /payments/webhook`

Admin service note:

- Admin orders page is API-backed via orders endpoint.
- Admin users page attempts `/users`; if unavailable, it falls back to `/auth/me`.

## Docker Development Context

Docker artifacts at root:

- `docker-compose.yml` - full dev stack (frontend + backend + postgres)
- `docker-compose.backend.yml` - backend + postgres only
- `docker-compose.frontend.yml` - frontend only
- `backend/Dockerfile`, `frontend/Dockerfile`
- `backend/.dockerignore`, `frontend/.dockerignore`

Dev workflow goals currently implemented:

- Host source bind-mounted into containers
- Hot reload enabled:
  - backend via `npm run dev:docker` (nodemon)
  - frontend via `npm run dev:docker` (Next dev server)
- PostgreSQL data persistence via named volume
- Non-root container user where possible

## Environment Variables

### Backend (from `backend/.env`)

Key variables include:

- `PORT`
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLIENT_ORIGIN`

### Frontend

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Testing and Quality Status

- Backend has lint/build/test scripts and Prisma workflows.
- Frontend has lint/build and Vitest component tests.
- Recent runs indicate frontend lint/build/tests are passing after fixes.

## Key Docs

- Backend API contract: `docs/backend-api.md`
- Frontend architecture: `docs/frontend-architecture.md`
- Frontend skeleton map: `docs/frontend-skeleton.md`
- Docker run guide: `docs/docker-development.md`

## Current Intent for Future Work

- Keep backend and frontend independently deployable.
- Continue replacing placeholder admin endpoints with dedicated backend admin APIs.
- Maintain modular feature boundaries in services, store slices, and UI components.
