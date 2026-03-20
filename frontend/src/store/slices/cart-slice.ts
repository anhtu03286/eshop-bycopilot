import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as cartService from "@/services/cart.service";
import type { Cart } from "@/services/types";

type CartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCartThunk = createAsyncThunk("cart/fetch", async () => cartService.getCart());

export const addCartItemThunk = createAsyncThunk(
  "cart/addItem",
  async (payload: { productId: string; quantity: number }) => cartService.addCartItem(payload.productId, payload.quantity),
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateItem",
  async (payload: { productId: string; quantity: number }) =>
    cartService.updateCartItem(payload.productId, payload.quantity),
);

export const removeCartItemThunk = createAsyncThunk("cart/removeItem", async (productId: string) =>
  cartService.removeCartItem(productId),
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load cart";
      })
      .addCase(addCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const cartReducer = cartSlice.reducer;
