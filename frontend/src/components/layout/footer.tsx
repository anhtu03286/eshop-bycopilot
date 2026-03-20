import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-slate-900">Fashion Store</p>
          <p className="mt-2">Modern essentials, secure checkout, and fast order tracking.</p>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-slate-900">Browse</p>
          <Link href="/products" className="block hover:text-sky-700">All products</Link>
          <Link href="/categories" className="block hover:text-sky-700">Categories</Link>
          <Link href="/search" className="block hover:text-sky-700">Search</Link>
        </div>
        <div className="space-y-2">
          <p className="font-medium text-slate-900">Account</p>
          <Link href="/profile" className="block hover:text-sky-700">Profile</Link>
          <Link href="/orders" className="block hover:text-sky-700">Orders</Link>
          <Link href="/cart" className="block hover:text-sky-700">Cart</Link>
        </div>
      </div>
    </footer>
  );
}
