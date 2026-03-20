import type { Product } from "@/services/types";
import { ProductCard } from "@/components/ui/product-card";

type Props = {
  products: Product[];
  onAddToCart?: (productId: string) => void;
};

export function ProductGrid({ products, onAddToCart }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
