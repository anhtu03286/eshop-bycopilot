import { apiClient } from "@/services/api/client";
import type { ApiResponse, AuthTokens, User } from "@/services/types";

export async function login(email: string, password: string) {
  const response = await apiClient.post<ApiResponse<AuthTokens>>("/auth/login", { email, password });
  return response.data.data;
}

export async function me() {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}

export async function logout(refreshToken: string) {
  await apiClient.post("/auth/logout", { refreshToken });
}
