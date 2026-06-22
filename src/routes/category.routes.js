// src/routes/category.routes.js
import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/category.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ─── Public routes ──────────────────────────────────────────
router.get("/", getAll);
router.get("/:id", getOne);

// ─── Admin only ─────────────────────────────────────────────
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),       // ← FormData parse + file → Cloudinary
  create
);

router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  update
);

router.delete("/:id", protect, authorize("admin", "superadmin"), remove);

export default router;