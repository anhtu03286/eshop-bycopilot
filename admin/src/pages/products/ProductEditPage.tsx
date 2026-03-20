import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "@/components/ui/ProductForm";
import { getProduct, updateProduct } from "@/services/products.service";
import { listCategories } from "@/services/categories.service";
import type { Category, Product } from "@/services/types";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";

export function ProductEditPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!slug) {
      setError("Missing product slug");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [found, allCategories] = await Promise.all([getProduct(slug), listCategories()]);
      setProduct(found);
      setCategories(allCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [slug]);

  if (loading) {
    return <LoadingState text="Loading product..." />;
  }

  if (error || !product) {
    return <ErrorState text={error ?? "Product not found"} onRetry={() => void load()} />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit Product</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <ProductForm
          categories={categories}
          initial={product}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            await updateProduct(product.id, payload);
            navigate("/products");
          }}
        />
      </div>
    </section>
  );
}
