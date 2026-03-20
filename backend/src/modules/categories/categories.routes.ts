import { Router } from "express";
import * as categoryService from "./categories.service";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const categories = await categoryService.listCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
});

export default router;
