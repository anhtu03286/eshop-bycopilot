import type { ApiResponse, AuthTokens, User } from "./types";
import { apiClient } from "./api/client";

export async function register(payload: { email: string; password: string }) {
  const response = await apiClient.post<ApiResponse<AuthTokens>>("/auth/register", payload);
  return response.data.data;
}

export async function login(payload: { email: string; password: string }) {
  const response = await apiClient.post<ApiResponse<AuthTokens>>("/auth/login", payload);
  return response.data.data;
}

export async function refreshSession() {
  const response = await apiClient.post<ApiResponse<AuthTokens>>("/auth/refresh", {});
  return response.data.data;
}

export async function logout(payload?: { refreshToken?: string }) {
  await apiClient.post("/auth/logout", payload ?? {});
}

export async function me() {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}
