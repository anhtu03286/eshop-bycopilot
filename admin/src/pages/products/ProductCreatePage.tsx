import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductForm } from "@/components/ui/ProductForm";
import { createProduct } from "@/services/products.service";
import { listCategories } from "@/services/categories.service";
import type { Category } from "@/services/types";

export function ProductCreatePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void listCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Create Product</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <ProductForm
          categories={categories}
          submitLabel="Create product"
          onSubmit={async (payload) => {
            await createProduct(payload);
            navigate("/products");
          }}
        />
      </div>
    </section>
  );
}
