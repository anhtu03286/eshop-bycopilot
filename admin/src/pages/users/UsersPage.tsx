import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/ui/DataTable";
import { ErrorState, LoadingState } from "@/components/ui/StatusState";
import { listUsers, setUserActiveState } from "@/services/users.service";
import type { User } from "@/services/types";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleToggle = async (user: User) => {
    await setUserActiveState(user.id, !user.isActive);
    await load();
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">User Management</h1>
      {loading ? <LoadingState text="Loading users..." /> : null}
      {error ? <ErrorState text={error} onRetry={() => void load()} /> : null}

      {!loading && !error ? (
        <DataTable
          rows={users}
          columns={[
            {
              key: "email",
              title: "Email",
              render: (row) => (
                <Link className="text-brand-700 hover:underline" to={`/users/${row.id}`}>
                  {row.email}
                </Link>
              ),
            },
            { key: "role", title: "Role", render: (row) => row.role },
            { key: "status", title: "Status", render: (row) => (row.isActive ? "Active" : "Disabled") },
            {
              key: "actions",
              title: "Actions",
              render: (row) => (
                <button
                  type="button"
                  onClick={() => void handleToggle(row)}
                  className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                >
                  {row.isActive ? "Disable" : "Enable"}
                </button>
              ),
            },
          ]}
        />
      ) : null}
    </section>
  );
}
