"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckoutForm } from "@/components/ui/checkout-form";
import { OrderSummary } from "@/components/ui/order-summary";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { fetchCartThunk } from "@/store/slices/cart-slice";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { initialized } = useAuthGuard();
  const cart = useAppSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialized) {
      void dispatch(fetchCartThunk());
    }
  }, [dispatch, initialized]);

  const handleSubmit = async () => {
    setLoading(true);
    router.push("/stripe");
  };

  return (
    <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <CheckoutForm onSubmit={handleSubmit} loading={loading} />
      <OrderSummary cart={cart} />
    </section>
  );
}
