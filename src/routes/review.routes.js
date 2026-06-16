// src/routes/product.routes.js
import express from "express";
import { createReview,getReviews,updateReview } from "../controllers/review.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post( "/:productId", protect, authorize("user"), createReview); 
router.get("/:productId", getReviews);     
router.put("/:reviewId", protect, authorize("user"), updateReview);          // POST   /api/products

export default router;