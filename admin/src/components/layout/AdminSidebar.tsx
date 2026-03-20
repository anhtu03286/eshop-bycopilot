import { NavLink } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/orders", label: "Orders" },
  { to: "/users", label: "Users" },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <h1 className="mb-6 text-xl font-bold text-slate-900">Fashion Admin</h1>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "block rounded-md px-3 py-2 text-sm font-medium transition",
                isActive ? "bg-brand-100 text-brand-700" : "text-slate-700 hover:bg-slate-100",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
