import { getAllBanner,CreateBanner,UpdateBannerById,DeleteBannerById } from "../controllers/banner.controller.js";
import { protect,authorize } from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();


router.get("/", getAllBanner);    
router.post("/",protect,authorize("superadmin"), CreateBanner);    
router.put("/:id",protect,authorize("superadmin"), UpdateBannerById);  
router.delete("/:id",protect,authorize("superadmin"), DeleteBannerById);  
export default router;                 