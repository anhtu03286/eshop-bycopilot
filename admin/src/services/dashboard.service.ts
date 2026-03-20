import { listOrders } from "@/services/orders.service";
import { listProducts } from "@/services/products.service";
import { listUsers } from "@/services/users.service";
import type { DashboardStats } from "@/services/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [products, orders, users] = await Promise.all([
    listProducts({ page: 1, pageSize: 1 }),
    listOrders(),
    listUsers(),
  ]);

  const estimatedRevenueCents = orders
    .filter((order) => order.status === "PAID" || order.paymentStatus === "SUCCEEDED")
    .reduce((sum, order) => sum + order.totalCents, 0);

  return {
    totalProducts: products.meta?.total ?? products.data.length,
    totalUsers: users.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === "PENDING").length,
    paidOrders: orders.filter((order) => order.status === "PAID").length,
    estimatedRevenueCents,
    recentOrders: orders.slice(0, 8),
  };
}
