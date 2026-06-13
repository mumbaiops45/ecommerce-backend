import express from "express";
import {
  getAllOrder,
  placeOrder,
  getMyOrders,
  getSingleOrder,
} from "../controllers/order.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { createOrderSchema } from "../validations/order.validation.js";

const router = express.Router();

// ─── All order routes require login ──────────────────────────────────────────
router.get("/all", protect, authorize("superadmin"), getAllOrder);
router.post("/", protect,authorize("user"), validate(createOrderSchema), placeOrder);
router.get("/", protect,authorize("user"), getMyOrders);
router.get("/:id", protect,authorize("user"), getSingleOrder);

export default router;
