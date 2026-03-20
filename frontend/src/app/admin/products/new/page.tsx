"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProduct } from "@/services/products.service";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  priceCents: z.number().int().positive(),
  inventory: z.number().int().nonnegative(),
});

type Values = z.infer<typeof schema>;

export default function CreateProductPage() {
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", priceCents: 1000, inventory: 1 },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createProduct(values);
    router.push("/admin/products");
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Create product</h1>
      <form className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2" onSubmit={onSubmit}>
        <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Input label="Slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
        <Input label="Description" {...form.register("description")} className="md:col-span-2" />
        <Input
          label="Price (cents)"
          type="number"
          {...form.register("priceCents", { valueAsNumber: true })}
          error={form.formState.errors.priceCents?.message}
        />
        <Input
          label="Inventory"
          type="number"
          {...form.register("inventory", { valueAsNumber: true })}
          error={form.formState.errors.inventory?.message}
        />
        <Button type="submit" className="md:col-span-2">Save product</Button>
      </form>
    </section>
  );
}
