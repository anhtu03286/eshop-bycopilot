# Fashion Backend

Node.js REST API for auth, catalog, cart, orders, and Stripe checkout.

## Tech Stack

- Express + TypeScript
- PostgreSQL + Prisma
- JWT access/refresh authentication
- Stripe Checkout + webhook confirmation

## Quick Start

1. Copy `.env.example` to `.env` and fill values.
2. Run migrations:
   - `npm run prisma:migrate`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Seed initial data:
   - `npm run prisma:seed`
5. Start in development mode:
   - `npm run dev`

## Scripts

- `npm run dev` - Run development server
- `npm run build` - Compile TypeScript
- `npm run start` - Run compiled server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run prisma:migrate` - Run Prisma migrations
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:seed` - Seed initial data

## API Base

- Base URL: `/api/v1`
- Health: `GET /api/v1/health`

## Modules

- `auth` - register, login, refresh, logout, me
- `products` - list/detail + admin CRUD
- `cart` - active cart + item mutations
- `orders` - create order from cart, list, detail
- `payments` - checkout session + Stripe webhook

## Security Notes

- Access tokens are short-lived JWTs.
- Refresh tokens are rotated and hashed in database.
- Auth routes are rate-limited.
- Admin product endpoints require `ADMIN` role.
- Stripe webhook requires signature verification.
