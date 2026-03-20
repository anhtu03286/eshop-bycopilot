"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { bootstrapSession } from "@/store/slices/auth-slice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(bootstrapSession());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
