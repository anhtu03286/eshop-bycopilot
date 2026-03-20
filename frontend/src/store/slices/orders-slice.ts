import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as ordersService from "@/services/orders.service";
import type { Order } from "@/services/types";

type OrdersState = {
  items: Order[];
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOrdersThunk = createAsyncThunk("orders/fetch", async () => ordersService.listOrders());

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load orders";
      });
  },
});

export const ordersReducer = ordersSlice.reducer;
