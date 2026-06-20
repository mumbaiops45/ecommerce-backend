import { getAllHeroBanner,getAllMiddleBanner,CreateBanner,UpdateBannerById,DeleteBannerById } from "../controllers/banner.controller.js";
import { protect,authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import express from "express";

const router = express.Router();

router.get("/hero", getAllHeroBanner);

router.get("/middle", getAllMiddleBanner);    
router.post("/",upload.single("image") ,protect,authorize("superadmin"), CreateBanner);    
router.put("/:id",upload.single("image") , protect,authorize("superadmin"), UpdateBannerById);  
router.delete("/:id",protect,authorize("superadmin"), DeleteBannerById);  
export default router;                 