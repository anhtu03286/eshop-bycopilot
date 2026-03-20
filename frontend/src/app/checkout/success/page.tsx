"use client";

import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
      <h1 className="text-2xl font-semibold text-emerald-800">Payment successful</h1>
      <p className="text-emerald-900">Your order has been confirmed. You can track it in your order history.</p>
      <Link href="/orders" className="font-medium text-emerald-700">
        View orders
      </Link>
    </section>
  );
}
