"use client";

import { useEffect } from "react";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { fetchOrdersThunk } from "@/store/slices/orders-slice";
import { formatMoney } from "@/utils/money";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { initialized } = useAuthGuard();
  const { items, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (initialized) {
      void dispatch(fetchOrdersThunk());
    }
  }, [dispatch, initialized]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Order history</h1>
      {loading ? <p>Loading orders...</p> : null}
      {items.map((order) => (
        <div key={order.id} className="rounded-md border border-slate-200 bg-white p-4">
          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
          <p className="text-sm text-slate-600">Status: {order.status} / Payment: {order.paymentStatus}</p>
          <p className="mt-1 text-sm">Total: {formatMoney(order.totalCents, order.currency.toUpperCase())}</p>
        </div>
      ))}
    </section>
  );
}
