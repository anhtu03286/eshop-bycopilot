import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import * as authService from "./auth.service";

const router = Router();

const credentialsSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
  params: z.object({}),
  query: z.object({}),
});

const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.post("/register", validate(credentialsSchema), async (req, res, next) => {
  try {
    const tokens = await authService.register(req.body.email, req.body.password);
    res.status(201).json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post("/login", validate(credentialsSchema), async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body.email, req.body.password);
    res.json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh", validate(refreshSchema), async (req, res, next) => {
  try {
    const tokens = await authService.refresh(req.body.refreshToken);
    res.json({ data: tokens });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", validate(refreshSchema), async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const me = await authService.getMe(req.auth!.userId);
    res.json({ data: me });
  } catch (err) {
    next(err);
  }
});

export default router;
