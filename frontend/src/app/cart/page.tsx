"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/ui/cart-item";
import { OrderSummary } from "@/components/ui/order-summary";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { fetchCartThunk, removeCartItemThunk, updateCartItemThunk } from "@/store/slices/cart-slice";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { initialized } = useAuthGuard();
  const cart = useAppSelector((state) => state.cart.cart);

  useEffect(() => {
    if (initialized) {
      void dispatch(fetchCartThunk());
    }
  }, [dispatch, initialized]);

  if (!initialized) {
    return <p>Loading...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-2">
        <p>Your cart is empty.</p>
        <Button onClick={() => router.push("/")}>Continue shopping</Button>
      </div>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      {cart.items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={(quantity) => void dispatch(updateCartItemThunk({ productId: item.productId, quantity }))}
          onRemove={() => void dispatch(removeCartItemThunk(item.productId))}
        />
      ))}
      <div className="flex justify-end">
        <Button onClick={() => router.push("/checkout")}>Checkout</Button>
      </div>
      </div>
      <OrderSummary cart={cart} />
    </section>
  );
}
