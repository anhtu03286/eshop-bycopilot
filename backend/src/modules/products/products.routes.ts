import { Router } from "express";
import { z } from "zod";
import { authenticate, requireRole } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import * as productService from "./products.service";

const router = Router();

const listSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    categorySlug: z.string().optional(),
  }),
});

const productSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    description: z.string().optional(),
    priceCents: z.number().int().positive(),
    inventory: z.number().int().nonnegative(),
    categoryId: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
    imageUrls: z.array(z.string().min(1)).optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateSchema = z.object({
  body: productSchema.shape.body.partial(),
  params: z.object({ productId: z.string().min(1) }),
  query: z.object({}).optional(),
});

router.get("/", validate(listSchema), async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
    const search = req.query.search ? String(req.query.search) : undefined;
    const categorySlug = req.query.categorySlug ? String(req.query.categorySlug) : undefined;
    const data = await productService.listProducts(page, pageSize, search, categorySlug);
    res.json({ data: data.items, meta: data.meta });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(String(req.params.slug));
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.post("/", authenticate, requireRole("ADMIN"), validate(productSchema), async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.put("/:productId", authenticate, requireRole("ADMIN"), validate(updateSchema), async (req, res, next) => {
  try {
    const product = await productService.updateProduct(String(req.params.productId), req.body);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.delete("/:productId", authenticate, requireRole("ADMIN"), async (req, res, next) => {
  try {
    await productService.deleteProduct(String(req.params.productId));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
