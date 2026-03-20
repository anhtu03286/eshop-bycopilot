import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
      <h1 className="text-2xl font-semibold text-emerald-800">Order confirmed</h1>
      <p className="text-emerald-900">Thank you for your purchase. We have received your order and will send updates soon.</p>
      <div className="flex gap-3">
        <Link href="/orders" className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white">View orders</Link>
        <Link href="/products" className="rounded-md border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800">Continue shopping</Link>
      </div>
    </section>
  );
}
