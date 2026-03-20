"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { z } from "zod";
import { useAdminGuard } from "@/hooks/use-auth-guard";
import { useAppDispatch, useAppSelector } from "@/hooks/use-app-store";
import { fetchProductsThunk } from "@/store/slices/products-slice";
import { createProduct, deleteProduct } from "@/services/products.service";
import { AdminTable } from "@/components/ui/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  priceCents: z.number().int().positive(),
  inventory: z.number().int().nonnegative(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { initialized } = useAdminGuard();
  const products = useAppSelector((state) => state.products.items);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      priceCents: 1000,
      inventory: 1,
    },
  });

  useEffect(() => {
    if (initialized) {
      void dispatch(fetchProductsThunk({ page: 1, pageSize: 50 }));
    }
  }, [dispatch, initialized]);

  const onSubmit = form.handleSubmit(async (values) => {
    await createProduct(values);
    await dispatch(fetchProductsThunk({ page: 1, pageSize: 50 }));
    form.reset();
  });

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
    await dispatch(fetchProductsThunk({ page: 1, pageSize: 50 }));
  };

  if (!initialized) {
    return <p>Loading...</p>;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin product management</h1>
        <Link href="/admin/products/new" className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white">
          New product page
        </Link>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
        <Input label="Slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
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
        <Input label="Description" {...form.register("description")} className="md:col-span-2" />
        <Button type="submit" className="md:col-span-2">
          Create product
        </Button>
      </form>

      <AdminTable
        rows={products}
        columns={[
          { key: "name", title: "Name", render: (row) => row.name },
          { key: "slug", title: "Slug", render: (row) => row.slug },
          { key: "price", title: "Price", render: (row) => `$${(row.priceCents / 100).toFixed(2)}` },
          { key: "inventory", title: "Inventory", render: (row) => row.inventory },
          {
            key: "actions",
            title: "Actions",
            render: (row) => (
              <div className="flex gap-2">
                <Link href={`/admin/products/${row.id}/edit`} className="rounded border border-slate-300 px-2 py-1 text-xs">
                  Edit
                </Link>
                <button
                  onClick={() => void handleDelete(row.id)}
                  className="rounded bg-rose-600 px-2 py-1 text-xs text-white"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
