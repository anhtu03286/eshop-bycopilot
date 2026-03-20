import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import * as cartService from "./cart.service";

const router = Router();

const itemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.auth!.userId);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
});

router.post("/items", validate(itemSchema), async (req, res, next) => {
  try {
    const cart = await cartService.addItem(req.auth!.userId, req.body.productId, req.body.quantity);
    res.status(201).json({ data: cart });
  } catch (err) {
    next(err);
  }
});

router.put("/items", validate(itemSchema), async (req, res, next) => {
  try {
    const cart = await cartService.updateItem(req.auth!.userId, req.body.productId, req.body.quantity);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
});

router.delete("/items/:productId", async (req, res, next) => {
  try {
    const cart = await cartService.removeItem(req.auth!.userId, req.params.productId);
    res.json({ data: cart });
  } catch (err) {
    next(err);
  }
});

export default router;
