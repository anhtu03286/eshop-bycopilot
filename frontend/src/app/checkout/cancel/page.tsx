"use client";

import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <section className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-6">
      <h1 className="text-2xl font-semibold text-amber-800">Payment canceled</h1>
      <p className="text-amber-900">No payment was processed. Your cart is still available for checkout.</p>
      <Link href="/cart" className="font-medium text-amber-700">
        Return to cart
      </Link>
    </section>
  );
}
