import type { ApiResponse, Category } from "./types";
import { apiClient } from "./api/client";

export async function listCategories() {
  const response = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
}
