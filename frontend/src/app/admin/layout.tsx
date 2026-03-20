"use client";

import { AdminSidebar } from "@/components/ui/admin-sidebar";
import { useAdminGuard } from "@/hooks/use-auth-guard";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";
  const { initialized } = useAdminGuard({ skipRedirect: isLoginRoute });

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!initialized) {
    return <p>Loading admin...</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <div>{children}</div>
    </div>
  );
}
