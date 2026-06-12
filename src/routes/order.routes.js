import express from "express";
import {
  placeOrder,
  getMyOrders,
  getSingleOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createOrderSchema } from "../validations/order.validation.js";

const router = express.Router();

// ─── All order routes require login ──────────────────────────────────────────
router.post("/", protect, validate(createOrderSchema), placeOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getSingleOrder);

export default router;
