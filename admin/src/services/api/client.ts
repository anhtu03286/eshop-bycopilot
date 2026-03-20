import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/utils/token";
import type { ApiResponse, AuthTokens } from "@/services/types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let queue: Array<() => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as { _retry?: boolean } & typeof error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const response = await axios.post<ApiResponse<AuthTokens>>(`${baseURL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: nextRefreshToken } = response.data.data;
      setTokens(accessToken, nextRefreshToken);
      queue.forEach((cb) => cb());
      queue = [];
      return apiClient(originalRequest);
    } catch (refreshError) {
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
