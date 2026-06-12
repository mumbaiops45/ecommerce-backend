import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/category.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getAll);     // GET  /api/categories?page=1&limit=10&sort=name&order=asc
router.get("/:id", getOne);  // GET  /api/categories/:id

// ─── Admin only ───────────────────────────────────────────────────────────────
router.post("/", protect, authorize("admin", "superadmin"), validate(createCategorySchema), create);
router.put("/:id", protect, authorize("admin", "superadmin"), validate(updateCategorySchema), update);
router.delete("/:id", protect, authorize("admin", "superadmin"), remove);

export default router;
