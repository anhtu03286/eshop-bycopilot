import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrder } from "@/services/orders.service";
import type { Order } from "@/services/types";
import { ErrorState, LoadingState } from "@/components/ui/StatusState";
import { formatCurrency, formatDate } from "@/utils/format";

export function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!orderId) {
      setError("Missing order id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setOrder(await getOrder(orderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [orderId]);

  if (loading) {
    return <LoadingState text="Loading order..." />;
  }

  if (error || !order) {
    return <ErrorState text={error ?? "Order not found"} onRetry={() => void load()} />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Order Detail</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Order ID</p>
        <p className="font-medium text-slate-900">{order.id}</p>
        <p className="mt-3 text-sm text-slate-500">Customer</p>
        <p className="font-medium text-slate-900">{order.user?.email ?? order.userId}</p>
        <p className="mt-3 text-sm text-slate-500">Created</p>
        <p className="font-medium text-slate-900">{formatDate(order.createdAt)}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Items</h2>
        <div className="mt-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">{item.productName}</p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
              <p className="font-medium text-slate-900">{formatCurrency(item.unitPriceCents * item.quantity, order.currency.toUpperCase())}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 text-right">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(order.totalCents, order.currency.toUpperCase())}</p>
        </div>
      </div>
    </section>
  );
}
