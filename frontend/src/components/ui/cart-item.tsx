import Link from "next/link";
import type { CartItem as CartItemType } from "@/services/types";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/utils/money";

type Props = {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItem({ item, onUpdateQuantity, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href={`/products/${item.product.slug}`} className="font-medium text-slate-900">
          {item.product.name}
        </Link>
        <p className="text-sm text-slate-600">{formatMoney(item.unitPriceCents, item.product.currency.toUpperCase())}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(event) => onUpdateQuantity(Number(event.target.value))}
          className="w-16 rounded border border-slate-300 px-2 py-1"
        />
        <Button variant="danger" onClick={onRemove}>Remove</Button>
      </div>
    </div>
  );
}
