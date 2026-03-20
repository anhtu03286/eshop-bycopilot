import { apiClient } from "@/services/api/client";
import type { ApiResponse, Product } from "@/services/types";

export async function listProducts(params: { page?: number; pageSize?: number; search?: string; categorySlug?: string }) {
  const response = await apiClient.get<ApiResponse<Product[]>>("/products", { params });
  return response.data;
}

export async function getProduct(slug: string) {
  const response = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
  return response.data.data;
}

export async function createProduct(payload: {
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  inventory: number;
  categoryId?: string;
  imageUrls?: string[];
}) {
  const response = await apiClient.post<ApiResponse<Product>>("/products", payload);
  return response.data.data;
}

export async function updateProduct(
  productId: string,
  payload: Partial<{
    name: string;
    slug: string;
    description?: string;
    priceCents: number;
    inventory: number;
    categoryId?: string;
    isActive: boolean;
    imageUrls?: string[];
  }>,
) {
  const response = await apiClient.put<ApiResponse<Product>>(`/products/${productId}`, payload);
  return response.data.data;
}

export async function deleteProduct(productId: string) {
  await apiClient.delete(`/products/${productId}`);
}
