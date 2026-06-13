import * as userService from "../services/user.service.js";

// ─── User self-service ────────────────────────────────────────────────────────

export const getMyProfile = async (req, res) => {
  try {
    const user = await userService.getMyProfile(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const user = await userService.updateMyProfile(req.user._id, req.body);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    await userService.changePassword(req.user._id, req.body);
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Superadmin user management ───────────────────────────────────────────────

export const getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const data = await userService.getUserWithOrders(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await userService.toggleBlockUser(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
