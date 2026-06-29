import express from "express";
import { getDashboardAnalytics } from "../controllers/analytics.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("superadmin"),
  getDashboardAnalytics
);

export default router;