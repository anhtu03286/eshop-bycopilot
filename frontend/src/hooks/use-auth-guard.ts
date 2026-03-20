"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./use-app-store";

export function useAuthGuard() {
  const router = useRouter();
  const { user, initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initialized && !user) {
      router.replace("/login");
    }
  }, [initialized, router, user]);

  return { user, initialized };
}

export function useAdminGuard(options?: { skipRedirect?: boolean }) {
  const router = useRouter();
  const { user, initialized } = useAppSelector((state) => state.auth);
  const skipRedirect = options?.skipRedirect ?? false;

  useEffect(() => {
    if (!skipRedirect && initialized && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [initialized, router, skipRedirect, user]);

  return { user, initialized };
}
