import { apiClient } from "@/services/api/client";
import type { ApiResponse, Order } from "@/services/types";

export async function listOrders() {
  const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
  return response.data.data;
}

export async function getOrder(orderId: string) {
  const response = await apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return response.data.data;
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "CANCELLED") {
  const response = await apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
  return response.data.data;
}
