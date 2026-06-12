import express from "express";
import {
  createPaymentOrder,
  verifyPaymentSignature,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── All payment routes require login ────────────────────────────────────────
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify", protect, verifyPaymentSignature);

export default router;
