import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deactivateAdmin,
  deleteAdmin,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes below are superadmin-only
router.use(protect, authorize("superadmin"));

router.get("/", getAllAdmins);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.put("/:id/deactivate", deactivateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
