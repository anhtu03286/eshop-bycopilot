import { apiClient } from "@/services/api/client";
import type { ApiResponse, Category } from "@/services/types";

export async function listCategories() {
  const response = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return response.data.data;
}
