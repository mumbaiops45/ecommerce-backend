import express from "express";
import {
  getUserCart,
  addItem,
  updateItem,
  removeItem,
  clearUserCart,
  getAllCartsAdmin,
} from "../controllers/cart.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const router = express.Router();

// Superadmin — view all carts with pagination/search/sort
router.get("/all", protect, authorize("superadmin"), getAllCartsAdmin);

// User cart routes
router.get("/", protect, authorize("user"), getUserCart);
router.post("/", protect, authorize("user"), validate(addToCartSchema), addItem);
router.put("/:productId", protect, authorize("user"), validate(updateCartItemSchema), updateItem);
router.delete("/clear", protect, authorize("user"), clearUserCart);
router.delete("/:productId", protect, authorize("user"), removeItem);

export default router;
