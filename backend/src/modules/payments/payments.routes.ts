import { Router } from "express";
import { authenticate } from "../../shared/middleware/auth";
import * as paymentService from "./payments.service";

const router = Router();

router.post("/webhook", async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: "Missing stripe signature" });
      return;
    }

    const result = await paymentService.handleWebhook(req.body as Buffer, signature);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/checkout-session", authenticate, async (req, res, next) => {
  try {
    const orderId = String(req.body.orderId ?? "");
    if (!orderId) {
      res.status(400).json({ error: "orderId is required" });
      return;
    }

    const session = await paymentService.createCheckoutSession(req.auth!.userId, orderId);
    res.status(201).json({ data: { id: session.id, url: session.url } });
  } catch (err) {
    next(err);
  }
});

export default router;
