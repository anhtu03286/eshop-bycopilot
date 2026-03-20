import { useAuth } from "@/hooks/useAuth";

export function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Admin control panel</p>
        <p className="text-lg font-semibold text-slate-900">Welcome, {user?.email}</p>
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </header>
  );
}
