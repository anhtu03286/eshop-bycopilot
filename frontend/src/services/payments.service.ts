import type { ApiResponse } from "./types";
import { apiClient } from "./api/client";

type CheckoutSession = {
  id: string;
  url: string;
};

export async function createCheckoutSession(orderId: string) {
  const response = await apiClient.post<ApiResponse<CheckoutSession>>("/payments/checkout-session", {
    orderId,
  });
  return response.data.data;
}

export async function redirectToCheckout(orderId: string) {
  const session = await createCheckoutSession(orderId);
  window.location.href = session.url;
}
