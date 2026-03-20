import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as productsService from "@/services/products.service";
import type { Product } from "@/services/types";

type ProductsState = {
  items: Product[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  page: 1,
  pageSize: 12,
  total: 0,
  loading: false,
  error: null,
};

export const fetchProductsThunk = createAsyncThunk(
  "products/fetch",
  async (payload: { page?: number; pageSize?: number; search?: string; categorySlug?: string } = {}) => {
    return productsService.listProducts(payload);
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.page = action.payload.meta?.page ?? 1;
        state.pageSize = action.payload.meta?.pageSize ?? 12;
        state.total = action.payload.meta?.total ?? action.payload.data.length;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load products";
      });
  },
});

export const productsReducer = productsSlice.reducer;
