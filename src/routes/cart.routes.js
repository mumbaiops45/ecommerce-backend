import express from "express";
import {
  getUserCart,
  addItem,
  updateItem,
  removeItem,
  clearUserCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = express.Router();

// ─── All cart routes require login ───────────────────────────────────────────
router.get("/", protect, getUserCart);
router.post("/", protect, validate(addToCartSchema), addItem);
router.put("/:productId", protect, validate(updateCartItemSchema), updateItem);
router.delete("/clear", protect, clearUserCart);
router.delete("/:productId", protect, removeItem);

export default router;
