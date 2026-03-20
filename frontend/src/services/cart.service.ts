import type { ApiResponse, Cart } from "./types";
import { apiClient } from "./api/client";

export async function getCart() {
  const response = await apiClient.get<ApiResponse<Cart>>("/cart");
  return response.data.data;
}

export async function addCartItem(productId: string, quantity: number) {
  const response = await apiClient.post<ApiResponse<Cart>>("/cart/items", { productId, quantity });
  return response.data.data;
}

export async function updateCartItem(productId: string, quantity: number) {
  const response = await apiClient.put<ApiResponse<Cart>>("/cart/items", { productId, quantity });
  return response.data.data;
}

export async function removeCartItem(productId: string) {
  const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${productId}`);
  return response.data.data;
}
