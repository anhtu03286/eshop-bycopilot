export type Role = "CUSTOMER" | "ADMIN";

export type ApiResponse<T> = {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type User = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type ProductImage = {
  id: string;
  url: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  _count?: {
    products: number;
  };
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

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  isActive: boolean;
  items: CartItem[];
  totalCents: number;
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
  stripeSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};
