"use client";

import { useEffect } from "react";
import { useState } from "react";
import { AdminTable } from "@/components/ui/admin-table";
import { listAdminOrders } from "@/services/admin.service";
import type { Order } from "@/services/types";
import { Button } from "@/components/ui/button";

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listAdminOrders();
      setRows(data);
    } catch {
      setError("Unable to load orders from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Order management</h1>
      {loading ? <p className="text-sm text-slate-600">Loading orders...</p> : null}
      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p>{error}</p>
          <Button className="mt-2" onClick={() => void loadOrders()}>
            Retry
          </Button>
        </div>
      ) : null}
      <AdminTable
        rows={rows}
        columns={[
          { key: "id", title: "Order", render: (row) => row.id.slice(0, 8) },
          { key: "status", title: "Status", render: (row) => row.status },
          { key: "payment", title: "Payment", render: (row) => row.paymentStatus },
          { key: "total", title: "Total", render: (row) => `$${(row.totalCents / 100).toFixed(2)}` },
        ]}
      />
    </section>
  );
}
