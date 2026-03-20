# Frontend Architecture

## Stack

- Next.js App Router + TypeScript
- TailwindCSS
- Redux Toolkit for centralized state
- Axios service layer for REST API communication
- Stripe.js for checkout redirect flow

## Structure

- `frontend/src/app` route-based pages
- `frontend/src/components` reusable UI and layout components
- `frontend/src/layouts` layout wrappers
- `frontend/src/services` API and domain services
- `frontend/src/store` Redux store and slices
- `frontend/src/hooks` typed store hooks and route guards
- `frontend/src/utils` shared utility functions
- `frontend/src/styles` shared style files

## Auth

- Access token is held in memory.
- Refresh flow is implemented with `withCredentials` and expects backend httpOnly cookie support.
- Protected and admin routes use client guards and backend authorization.

## Checkout

1. Create order with `POST /orders`.
2. Create Stripe session with `POST /payments/checkout-session`.
3. Redirect user to Stripe-hosted checkout.
4. On return, show success or cancel page and refresh orders/cart state.
