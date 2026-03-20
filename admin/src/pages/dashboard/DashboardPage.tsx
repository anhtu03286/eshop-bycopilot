import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboard.service";
import type { DashboardStats } from "@/services/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { LoadingState, ErrorState } from "@/components/ui/StatusState";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setStats(await getDashboardStats());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return <LoadingState text="Loading dashboard..." />;
  }

  if (error || !stats) {
    return <ErrorState text={error ?? "Dashboard unavailable"} onRetry={() => void load()} />;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Card title="Products" value={String(stats.totalProducts)} />
        <Card title="Users" value={String(stats.totalUsers)} />
        <Card title="Orders" value={String(stats.totalOrders)} />
        <Card title="Pending orders" value={String(stats.pendingOrders)} />
        <Card title="Paid orders" value={String(stats.paidOrders)} />
        <Card title="Revenue" value={formatCurrency(stats.estimatedRevenueCents)} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Recent orders</h2>
        <div className="mt-3 space-y-3">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">Order {order.id.slice(0, 8)}</p>
                <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-800">{formatCurrency(order.totalCents, order.currency.toUpperCase())}</p>
                <p className="text-xs text-slate-500">{order.status}</p>
              </div>
            </div>
          ))}
          {stats.recentOrders.length === 0 ? <p className="text-sm text-slate-500">No recent orders found.</p> : null}
        </div>
      </div>
    </section>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
