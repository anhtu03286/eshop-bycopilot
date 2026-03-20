export type ApiResponse<T> = {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type Role = "CUSTOMER" | "ADMIN";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type ProductImage = {
  id: string;
  url: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  priceCents: number;
  currency: string;
  inventory: number;
  isActive: boolean;
  categoryId?: string | null;
  category?: Category | null;
  images: ProductImage[];
};

export type User = {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
};

export type Order = {
  id: string;
  userId: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  paymentStatus: "PENDING" | "SUCCEEDED" | "FAILED";
  totalCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: User;
};

export type DashboardStats = {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  estimatedRevenueCents: number;
  recentOrders: Order[];
};
