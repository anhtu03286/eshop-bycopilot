import type { ApiResponse, Order } from "./types";
import { apiClient } from "./api/client";

export async function createOrder() {
  const response = await apiClient.post<ApiResponse<Order>>("/orders", {});
  return response.data.data;
}

export async function listOrders() {
  const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
  return response.data.data;
}

export async function getOrder(orderId: string) {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
}
