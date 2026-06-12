// src/routes/product.routes.js
import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  addProductReview,
  deleteProductReview,
  getByCategory,
} from "../controllers/product.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", getAll);                                // GET  /api/products?page&limit&sort&order&search&category&brand&minPrice&maxPrice
router.get("/category/:categoryId", getByCategory);    // GET  /api/products/category/:categoryId
router.get("/:id", getOne);                             // GET  /api/products/:id

// ─── Protected (logged-in users) ─────────────────────────────────────────────
router.post("/:id/reviews", protect,authorize("user"), addProductReview);     // POST   /api/products/:id/reviews
router.delete("/:id/reviews", protect,authorize("user"), deleteProductReview);// DELETE /api/products/:id/reviews

// ─── Admin only ───────────────────────────────────────────────────────────────
router.post("/", protect, authorize("admin", "superadmin"), create);                // POST   /api/products
router.put("/:id", protect, authorize("admin", "superadmin"), update);              // PUT    /api/products/:id
router.delete("/:id", protect, authorize("admin", "superadmin"), remove);           // DELETE /api/products/:id

export default router;