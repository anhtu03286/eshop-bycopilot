"use client";

import { useEffect, useState } from "react";
import { AdminTable } from "@/components/ui/admin-table";
import { Button } from "@/components/ui/button";
import { listAdminUsers } from "@/services/admin.service";
import type { User } from "@/services/types";

export default function AdminUsersPage() {
  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listAdminUsers();
      setRows(data);
    } catch {
      setError("Unable to load users from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User management</h1>
      <p className="text-sm text-slate-600">Connected to API. Falls back to current user when /users is unavailable.</p>
      {loading ? <p className="text-sm text-slate-600">Loading users...</p> : null}
      {error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          <p>{error}</p>
          <Button className="mt-2" onClick={() => void loadUsers()}>
            Retry
          </Button>
        </div>
      ) : null}
      <AdminTable
        rows={rows}
        columns={[
          { key: "id", title: "User ID", render: (row) => row.id.slice(0, 8) },
          { key: "email", title: "Email", render: (row) => row.email },
          { key: "role", title: "Role", render: (row) => row.role },
          { key: "created", title: "Created", render: (row) => new Date(row.createdAt).toLocaleDateString() },
        ]}
      />
    </section>
  );
}
