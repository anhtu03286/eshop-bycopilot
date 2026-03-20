"use client";

import { useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { addCartItemThunk } from "@/store/slices/cart-slice";
import { fetchProductsThunk } from "@/store/slices/products-slice";
import { ProductGrid } from "@/components/ui/product-grid";

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.products);

  useEffect(() => {
    void dispatch(fetchProductsThunk({ page: 1, pageSize: 12, categorySlug: params?.slug ?? "" }));
  }, [dispatch, params?.slug]);

  const title = useMemo(() => (params?.slug ?? "category").replace(/-/g, " "), [params?.slug]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold capitalize">Category: {title}</h1>
      <ProductGrid products={items} onAddToCart={(productId) => void dispatch(addCartItemThunk({ productId, quantity: 1 }))} />
    </section>
  );
}
