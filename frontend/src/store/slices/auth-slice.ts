import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "@/services/auth.service";
import { clearAccessToken, setAccessToken } from "@/services/token-manager";
import type { Role } from "@/services/types";

type AuthState = {
  user: null | {
    id: string;
    email: string;
    role: Role;
    createdAt: string;
  };
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
};

export const bootstrapSession = createAsyncThunk("auth/bootstrap", async () => {
  const refreshed = await authService.refreshSession();
  setAccessToken(refreshed.accessToken);
  const user = await authService.me();
  return user;
});

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }) => {
    const tokens = await authService.login(payload);
    setAccessToken(tokens.accessToken);
    return authService.me();
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: { email: string; password: string }) => {
    const tokens = await authService.register(payload);
    setAccessToken(tokens.accessToken);
    return authService.me();
  },
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
  clearAccessToken();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Login failed";
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Registration failed";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      });
  },
});

export const authReducer = authSlice.reducer;
