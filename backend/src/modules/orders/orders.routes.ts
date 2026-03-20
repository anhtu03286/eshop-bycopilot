import { Router } from "express";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import * as orderService from "./orders.service";

const router = Router();

const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
  params: z.object({ orderId: z.string().min(1) }),
  query: z.object({}).optional(),
});

router.use(authenticate);

router.post("/", async (req, res, next) => {
  try {
    const order = await orderService.createOrderFromCart(req.auth!.userId);
    res.status(201).json({ data: order });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const orders =
      req.auth!.role === "ADMIN" ? await orderService.listAllOrders() : await orderService.listOrders(req.auth!.userId);
    res.json({ data: orders });
  } catch (err) {
    next(err);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const order =
      req.auth!.role === "ADMIN"
        ? await orderService.getOrderAsAdmin(req.params.orderId)
        : await orderService.getOrder(req.auth!.userId, req.params.orderId);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
});

router.patch("/:orderId/status", validate(updateStatusSchema), async (req, res, next) => {
  try {
    if (req.auth?.role !== "ADMIN") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const order = await orderService.updateOrderStatus(String(req.params.orderId), req.body.status as OrderStatus);
    res.json({ data: order });
  } catch (err) {
    next(err);
  }
});

export default router;
