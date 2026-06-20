
import express from "express";
import { createShipping,getShipping,updateShipping } from "../controllers/shipping.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";
const router = express.Router();



router.post("/", protect, authorize("superadmin"), createShipping);

router.get("/", getShipping);

router.put("/:id", protect, authorize("superadmin"), updateShipping);
export default router;