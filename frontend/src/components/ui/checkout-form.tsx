"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().min(3),
});

type Values = z.infer<typeof schema>;

type Props = {
  onSubmit: (values: Values) => Promise<void>;
  loading?: boolean;
};

export function CheckoutForm({ onSubmit, loading }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
    },
  });

  return (
    <form className="space-y-3 rounded-xl border border-slate-200 bg-white p-4" onSubmit={form.handleSubmit(onSubmit)}>
      <h2 className="text-lg font-semibold">Shipping details</h2>
      <Input label="Full name" {...form.register("fullName")} error={form.formState.errors.fullName?.message} />
      <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
      <Input label="Address" {...form.register("address")} error={form.formState.errors.address?.message} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="City" {...form.register("city")} error={form.formState.errors.city?.message} />
        <Input
          label="Postal code"
          {...form.register("postalCode")}
          error={form.formState.errors.postalCode?.message}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Processing..." : "Continue to payment"}</Button>
    </form>
  );
}
