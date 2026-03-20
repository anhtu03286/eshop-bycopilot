"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/ui/product-grid";
import { addCartItemThunk } from "@/store/slices/cart-slice";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { fetchProductsThunk } from "@/store/slices/products-slice";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void dispatch(fetchProductsThunk({ page: 1, pageSize: 12 }));
  }, [dispatch]);

  const onSearch = () => {
    void dispatch(fetchProductsThunk({ page: 1, pageSize: 12, search }));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-sky-700 to-cyan-500 p-6 text-white">
        <h1 className="text-3xl font-semibold">New season, fresh essentials</h1>
        <p className="mt-2 text-sm opacity-90">Browse products, manage your cart, and checkout securely.</p>
        <div className="mt-4 flex gap-2">
          <Link href="/products" className="rounded-md bg-white px-4 py-2 text-sm font-medium text-sky-700">
            Explore products
          </Link>
          <Link href="/categories" className="rounded-md border border-white/70 px-4 py-2 text-sm font-medium text-white">
            Browse categories
          </Link>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <button onClick={onSearch} className="rounded-md bg-sky-600 px-4 py-2 text-white">
          Search
        </button>
      </div>

      {loading ? <p>Loading products...</p> : null}
      <ProductGrid products={items} onAddToCart={(productId) => void dispatch(addCartItemThunk({ productId, quantity: 1 }))} />
    </section>
  );
}
