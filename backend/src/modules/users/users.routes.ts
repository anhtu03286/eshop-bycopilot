import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import * as userService from "./users.service";

const router = Router();

const statusSchema = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
  params: z.object({ userId: z.string().min(1) }),
  query: z.object({}).optional(),
});

router.use(authenticate, requireRole("ADMIN"));

router.get("/", async (_req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const user = await userService.getUserById(String(req.params.userId));
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

router.patch("/:userId/status", validate(statusSchema), async (req, res, next) => {
  try {
    const user = await userService.setUserActiveState(String(req.params.userId), Boolean(req.body.isActive));
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
