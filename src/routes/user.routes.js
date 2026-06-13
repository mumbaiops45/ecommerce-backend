import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validations/user.validation.js";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getAllUsers,
  getUserById,
  blockUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// ─── Normal user — own profile (role: user) ───────────────────────────────────
router.get("/me", protect, authorize("user"), getMyProfile);
router.put("/me", protect, authorize("user"), validate(updateProfileSchema), updateMyProfile);
router.put("/me/password", protect, authorize("user"), validate(changePasswordSchema), changePassword);

// ─── Superadmin — user management ────────────────────────────────────────────
router.use(protect, authorize("superadmin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/block", blockUser);

export default router;
