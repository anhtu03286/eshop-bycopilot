"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/services/orders.service";
import { redirectToCheckout } from "@/services/payments.service";

export default function StripePaymentPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const payNow = async () => {
    setLoading(true);
    try {
      const order = await createOrder();
      await redirectToCheckout(order.id);
    } catch {
      router.push("/checkout/cancel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Stripe payment</h1>
      <p className="text-sm text-slate-600">You will be redirected to secure Stripe checkout to complete your payment.</p>
      <Button onClick={() => void payNow()} disabled={loading} className="w-full">
        {loading ? "Redirecting..." : "Pay with Stripe"}
      </Button>
    </section>
  );
}
