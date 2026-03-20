import axios from "axios";
import { apiClient } from "@/services/api/client";
import type { ApiResponse, Order, User } from "@/services/types";

export async function listAdminOrders(): Promise<Order[]> {
  const response = await apiClient.get<ApiResponse<Order[]>>("/orders");
  return response.data.data;
}

export async function listAdminUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const meResponse = await apiClient.get<ApiResponse<User>>("/auth/me");
      return [meResponse.data.data];
    }

    throw error;
  }
}
