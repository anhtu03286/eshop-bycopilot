import type { Cart } from "@/services/types";
import { formatMoney } from "@/utils/money";

export function OrderSummary({ cart }: { cart: Cart | null }) {
  const subtotal = cart?.totalCents ?? 0;
  const shipping = subtotal > 0 ? 800 : 0;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatMoney(subtotal)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>{formatMoney(shipping)}</span></div>
        <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold"><span>Total</span><span>{formatMoney(total)}</span></div>
      </div>
    </aside>
  );
}
