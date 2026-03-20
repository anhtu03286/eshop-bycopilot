# Frontend Skeleton Structure

## Folder Structure

frontend/
  src/
    app/
      page.tsx
      products/page.tsx
      products/[slug]/page.tsx
      categories/page.tsx
      categories/[slug]/page.tsx
      search/page.tsx
      login/page.tsx
      register/page.tsx
      profile/page.tsx
      orders/page.tsx
      cart/page.tsx
      checkout/page.tsx
      stripe/page.tsx
      order-confirmation/page.tsx
      admin/
        layout.tsx
        login/page.tsx
        products/page.tsx
        products/new/page.tsx
        products/[id]/edit/page.tsx
        orders/page.tsx
        users/page.tsx
    components/
      layout/
        top-nav.tsx
        footer.tsx
      ui/
        button.tsx
        input.tsx
        card.tsx
        product-card.tsx
        product-grid.tsx
        cart-item.tsx
        checkout-form.tsx
        order-summary.tsx
        admin-sidebar.tsx
        admin-table.tsx
    services/
      api/client.ts
      auth.service.ts
      products.service.ts
      cart.service.ts
      orders.service.ts
      payments.service.ts
      token-manager.ts
      types.ts
    store/
      index.ts
      slices/
        auth-slice.ts
        products-slice.ts
        cart-slice.ts
        orders-slice.ts
    hooks/
      use-app-store.ts
      use-auth-guard.ts
    utils/
      env.ts
      money.ts
      error.ts

## Routing Overview

- Public: `/`, `/products`, `/products/[slug]`, `/categories`, `/categories/[slug]`, `/search`
- User: `/login`, `/register`, `/profile`, `/orders`
- Shopping: `/cart`, `/checkout`, `/stripe`, `/order-confirmation`, `/checkout/success`, `/checkout/cancel`
- Admin: `/admin/login`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/orders`, `/admin/users`

## Integration Notes

- Central API client is in `src/services/api/client.ts`.
- API base URL uses `NEXT_PUBLIC_API_BASE_URL`.
- Stripe publishable key uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Redux Toolkit store provides centralized state management for auth, products, cart, and orders.
