import Link from "next/link";
import type { Product } from "@/services/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney } from "@/utils/money";

type Props = {
  product: Product;
  onAddToCart?: (productId: string) => void;
};

export function ProductCard({ product, onAddToCart }: Props) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{product.currency.toUpperCase()}</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.description ?? "No description"}</p>
      </div>
      <div className="mt-4 space-y-3">
        <p className="text-base font-semibold text-slate-900">{formatMoney(product.priceCents, product.currency.toUpperCase())}</p>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">
            Details
          </Link>
          <Button className="flex-1" onClick={() => onAddToCart?.(product.id)}>
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
