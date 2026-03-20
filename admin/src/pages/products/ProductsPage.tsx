import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";
import { deleteProduct, listProducts } from "@/services/products.service";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@/services/types";

export function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await listProducts({ page: nextPage, pageSize });
      setItems(response.data);
      setTotal(response.meta?.total ?? response.data.length);
      setPage(nextPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(1);
  }, []);

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    await deleteProduct(productId);
    await load(page);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Management</h1>
        <Link to="/products/new" className="rounded bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Create product
        </Link>
      </div>

      {loading ? <LoadingState text="Loading products..." /> : null}
      {error ? <ErrorState text={error} onRetry={() => void load(page)} /> : null}

      {!loading && !error ? (
        <>
          <DataTable
            rows={items}
            emptyText="No products found"
            columns={[
              { key: "name", title: "Name", render: (row) => row.name },
              { key: "slug", title: "Slug", render: (row) => row.slug },
              {
                key: "category",
                title: "Category",
                render: (row) => row.category?.name ?? "-",
              },
              {
                key: "price",
                title: "Price",
                render: (row) => formatCurrency(row.priceCents, row.currency.toUpperCase()),
              },
              { key: "inventory", title: "Inventory", render: (row) => row.inventory },
              {
                key: "actions",
                title: "Actions",
                render: (row) => (
                  <div className="flex gap-2">
                    <Link
                      to={`/products/${row.slug}/edit`}
                      className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.id)}
                      className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={(next) => void load(next)} />
        </>
      ) : null}
    </section>
  );
}
