import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import categoryRoutes from "./modules/categories/categories.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import productRoutes from "./modules/products/products.routes";
import userRoutes from "./modules/users/users.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/users", userRoutes);

export default router;
