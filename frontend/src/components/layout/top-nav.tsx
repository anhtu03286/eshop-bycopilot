"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { logoutThunk } from "@/store/slices/auth-slice";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cartCount = useAppSelector((state) => state.cart.cart?.items.length ?? 0);

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Fashion Store
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
          <Link href="/">Shop</Link>
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/search">Search</Link>
          <Link href="/cart">Cart ({cartCount})</Link>
          {user ? <Link href="/orders">Orders</Link> : null}
          {user ? <Link href="/profile">Profile</Link> : null}
          {user?.role === "ADMIN" ? <Link href="/admin/products">Admin</Link> : null}
          {user?.role === "ADMIN" ? <Link href="/admin/orders">Manage orders</Link> : null}
          {!user ? <Link href="/login">Login</Link> : null}
          {!user ? <Link href="/register">Register</Link> : null}
          {user ? (
            <Button variant="secondary" onClick={() => void dispatch(logoutThunk())}>
              Logout
            </Button>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
