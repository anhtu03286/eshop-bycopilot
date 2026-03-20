import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser } from "@/services/users.service";
import { ErrorState, LoadingState } from "@/components/ui/StatusState";
import { formatCurrency, formatDate } from "@/utils/format";
import type { User } from "@/services/types";

type UserDetail = User & {
  orders?: Array<{
    id: string;
    totalCents: number;
    status: string;
    createdAt: string;
  }>;
};

export function UserDetailPage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!userId) {
      setError("Missing user id");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setUser(await getUser(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [userId]);

  if (loading) {
    return <LoadingState text="Loading user..." />;
  }

  if (error || !user) {
    return <ErrorState text={error ?? "User not found"} onRetry={() => void load()} />;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User Detail</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Email</p>
        <p className="font-medium text-slate-900">{user.email}</p>
        <p className="mt-3 text-sm text-slate-500">Role</p>
        <p className="font-medium text-slate-900">{user.role}</p>
        <p className="mt-3 text-sm text-slate-500">Status</p>
        <p className="font-medium text-slate-900">{user.isActive ? "Active" : "Disabled"}</p>
        <p className="mt-3 text-sm text-slate-500">Created</p>
        <p className="font-medium text-slate-900">{formatDate(user.createdAt)}</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <div className="mt-3 space-y-2">
          {user.orders?.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">{order.id.slice(0, 8)}</p>
                <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{formatCurrency(order.totalCents)}</p>
                <p className="text-xs text-slate-500">{order.status}</p>
              </div>
            </div>
          ))}
          {!user.orders || user.orders.length === 0 ? <p className="text-sm text-slate-500">No recent orders</p> : null}
        </div>
      </div>
    </section>
  );
}
