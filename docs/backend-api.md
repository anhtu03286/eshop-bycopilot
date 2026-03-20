# Backend API Overview

Base path: `/api/v1`

## Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Catalog

- `GET /categories`
- `GET /products`
- `GET /products/:slug`
- `POST /products` (ADMIN)
- `PUT /products/:productId` (ADMIN)
- `DELETE /products/:productId` (ADMIN)

## Cart

- `GET /cart`
- `POST /cart/items`
- `PUT /cart/items`
- `DELETE /cart/items/:productId`

## Orders

- `POST /orders`
- `GET /orders`
- `GET /orders/:orderId`
- `PATCH /orders/:orderId/status` (ADMIN)

## Users (Admin)

- `GET /users` (ADMIN)
- `GET /users/:userId` (ADMIN)
- `PATCH /users/:userId/status` (ADMIN)

## Payments

- `POST /payments/checkout-session`
- `POST /payments/webhook`
