import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { createwishlist ,getwishlist,Deletewishlist } from "../controllers/wishlist.controller.js";
const router = express.Router();

router.get("/", protect, authorize("user"), getwishlist);
router.post("/", protect, authorize("user"), createwishlist);
router.delete("/:Id", protect, authorize("user"), Deletewishlist);


export default router;
