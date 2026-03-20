"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/use-app-store";
import { loginThunk } from "@/store/slices/auth-slice";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type Values = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await dispatch(loginThunk(values));
    router.push("/admin/products");
  });

  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Admin login</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </section>
  );
}
