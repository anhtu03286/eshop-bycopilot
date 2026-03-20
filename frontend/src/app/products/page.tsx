"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { addCartItemThunk } from "@/store/slices/cart-slice";
import { fetchProductsThunk } from "@/store/slices/products-slice";
import { ProductGrid } from "@/components/ui/product-grid";

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    void dispatch(fetchProductsThunk({ page: 1, pageSize: 18 }));
  }, [dispatch]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">All products</h1>
        <p className="text-sm text-slate-600">Browse our full catalog of curated essentials.</p>
      </div>
      {loading ? <p>Loading products...</p> : null}
      <ProductGrid products={items} onAddToCart={(productId) => void dispatch(addCartItemThunk({ productId, quantity: 1 }))} />
    </section>
  );
}
