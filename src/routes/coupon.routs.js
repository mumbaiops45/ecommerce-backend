import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { getAllCoupon,createCoupon,updateCouponById,getCouponById,deleteCouponById} from "../controllers/coupon.controller.js";

const router = express.Router();
router.post("/", protect, authorize("superadmin"), createCoupon);
router.get("/", getAllCoupon); 
router.put("/:id", protect, authorize("superadmin"), updateCouponById);
router.get("/:id", protect, authorize("superadmin"), getCouponById);
router.delete("/:id", protect, authorize("superadmin"), deleteCouponById);
export default router;
