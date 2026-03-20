import { apiClient } from "@/services/api/client";
import type { ApiResponse, User } from "@/services/types";

export async function listUsers() {
  const response = await apiClient.get<ApiResponse<User[]>>("/users");
  return response.data.data;
}

export async function getUser(userId: string) {
  const response = await apiClient.get<ApiResponse<User & { orders?: Array<{ id: string; totalCents: number; status: string; createdAt: string }> }>>(
    `/users/${userId}`,
  );
  return response.data.data;
}

export async function setUserActiveState(userId: string, isActive: boolean) {
  const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}/status`, { isActive });
  return response.data.data;
}
