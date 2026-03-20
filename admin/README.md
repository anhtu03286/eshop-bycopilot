# Fashion Admin

Separate admin web application for ecommerce operations.

## Stack

- React + Vite + TypeScript
- TailwindCSS
- React Router
- Axios API client

## Features

- Admin authentication (JWT)
- Dashboard with key statistics and recent orders
- Product management (list, create, edit, delete, image upload)
- Order management (list, detail, update status)
- User management (list, detail, enable/disable)
- Protected routes and loading/error states

## Environment

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL=http://localhost:3000/api/v1`

## Run

```bash
npm install
npm run dev
```

Default local admin URL: `http://localhost:5174`

## Notes

Backend CORS must allow admin origin. Set backend `CLIENT_ORIGIN` to include both storefront and admin origins, for example:

`CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174`
