import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";
import { listOrders, updateOrderStatus } from "@/services/orders.service";
import type { Order } from "@/services/types";
import { formatCurrency, formatDate } from "@/utils/format";

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await listOrders());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleStatusChange = async (orderId: string, status: "PENDING" | "PAID" | "CANCELLED") => {
    await updateOrderStatus(orderId, status);
    await load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Order Management</h1>
      {loading ? <LoadingState text="Loading orders..." /> : null}
      {error ? <ErrorState text={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <DataTable
          rows={orders}
          columns={[
            {
              key: "id",
              title: "Order",
              render: (row) => (
                <Link className="text-brand-700 hover:underline" to={`/orders/${row.id}`}>
                  {row.id.slice(0, 8)}
                </Link>
              ),
            },
            {
              key: "user",
              title: "Customer",
              render: (row) => row.user?.email ?? row.userId,
            },
            {
              key: "total",
              title: "Total",
              render: (row) => formatCurrency(row.totalCents, row.currency.toUpperCase()),
            },
            {
              key: "createdAt",
              title: "Created",
              render: (row) => formatDate(row.createdAt),
            },
            {
              key: "status",
              title: "Status",
              render: (row) => (
                <select
                  className="rounded border border-slate-300 px-2 py-1 text-xs"
                  value={row.status}
                  onChange={(e) => void handleStatusChange(row.id, e.target.value as "PENDING" | "PAID" | "CANCELLED")}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              ),
            },
          ]}
        />
      ) : null}
    </section>
  );
}
