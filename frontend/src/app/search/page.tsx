"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { addCartItemThunk } from "@/store/slices/cart-slice";
import { fetchProductsThunk } from "@/store/slices/products-slice";
import { ProductGrid } from "@/components/ui/product-grid";

export default function SearchPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.products);
  const [query, setQuery] = useState("");

  const runSearch = () => {
    void dispatch(fetchProductsThunk({ page: 1, pageSize: 12, search: query }));
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Search results</h1>
      <div className="flex gap-2">
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or description"
        />
        <button onClick={runSearch} className="rounded-md bg-sky-600 px-4 py-2 text-white">Search</button>
      </div>
      {loading ? <p>Searching...</p> : null}
      <ProductGrid products={items} onAddToCart={(productId) => void dispatch(addCartItemThunk({ productId, quantity: 1 }))} />
    </section>
  );
}
