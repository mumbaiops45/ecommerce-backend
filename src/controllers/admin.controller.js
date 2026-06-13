import * as adminService from "../services/admin.service.js";

export const getAllAdmins = async (req, res) => {
  try {
    const result = await adminService.getAllAdmins(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "name, email, phone and password are required" });
    }

    const admin = await adminService.createAdmin({ name, email, phone, password });
    res.status(201).json({ success: true, message: "Admin created", admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Admin updated", admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deactivateAdmin = async (req, res) => {
  try {
    const admin = await adminService.toggleDeactivateAdmin(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: admin.isBlocked ? "Admin deactivated" : "Admin activated",
      isBlocked: admin.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await adminService.deleteAdmin(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
