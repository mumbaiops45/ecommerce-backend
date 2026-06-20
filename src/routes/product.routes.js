// src/routes/product.routes.js
import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  getByCategory,
} from "../controllers/product.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getAll);                                // GET  /api/products?page&limit&sort&order&search&category&brand&minPrice&maxPrice
router.get("/category/:categoryId", getByCategory);    // GET  /api/products/category/:categoryId
router.get("/:id", getOne);                             // GET  /api/products/:id

// ─── Admin only ───────────────────────────────────────────────────────────────
router.post("/", protect,upload.array("images", 10), authorize("admin", "superadmin"), create);                // POST   /api/products
router.put("/:id",upload.array("images", 10), protect, authorize("admin", "superadmin"), update);              // PUT    /api/products/:id
router.delete("/:id", protect, authorize("admin", "superadmin"), remove);           // DELETE /api/products/:id

export default router;