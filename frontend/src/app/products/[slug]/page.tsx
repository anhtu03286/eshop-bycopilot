"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { addCartItemThunk } from "@/store/slices/cart-slice";
import { useAppDispatch } from "@/hooks/use-app-store";
import { getProduct } from "@/services/products.service";
import type { Product } from "@/services/types";
import { formatMoney } from "@/utils/money";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const found = await getProduct(slug);
        setProduct(found);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [slug]);

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <Card className="max-w-2xl space-y-3">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="text-slate-600">{product.description ?? "No description"}</p>
      <p className="text-lg font-medium">{formatMoney(product.priceCents, product.currency.toUpperCase())}</p>
      <Button onClick={() => void dispatch(addCartItemThunk({ productId: product.id, quantity: 1 }))}>Add to cart</Button>
    </Card>
  );
}
