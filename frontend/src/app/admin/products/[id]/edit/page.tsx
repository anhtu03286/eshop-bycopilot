"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { listProducts, updateProduct } from "@/services/products.service";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  priceCents: z.number().int().positive(),
  inventory: z.number().int().nonnegative(),
});

type Values = z.infer<typeof schema>;

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", priceCents: 1000, inventory: 1 },
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await listProducts({ page: 1, pageSize: 100 });
        const product = response.data.find((item) => item.id === params?.id);
        if (product) {
          form.reset({
            name: product.name,
            slug: product.slug,
            description: product.description,
            priceCents: product.priceCents,
            inventory: product.inventory,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [form, params?.id]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!params?.id) return;
    await updateProduct(params.id, values);
    router.push("/admin/products");
  });

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit product</h1>
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
        <Button type="submit" className="md:col-span-2">Update product</Button>
      </form>
    </section>
  );
}
