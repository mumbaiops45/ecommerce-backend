import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Order from "../models/Order.model.js";

const ALLOWED_SORT = ["createdAt", "name", "email"];

// ─── User self-service ────────────────────────────────────────────────────────

export const getMyProfile = async (userId) => {
  return User.findById(userId).select("-password");
};

export const updateMyProfile = async (userId, { name, email, phone, profile }) => {
  const user = await User.findById(userId);
  if (!user) return null;

  if (email && email !== user.email) {
    const taken = await User.findOne({ email, _id: { $ne: userId } });
    if (taken) throw new Error("Email already in use");
    user.email = email;
  }

  if (phone && phone !== user.phone) {
    const taken = await User.findOne({ phone, _id: { $ne: userId } });
    if (taken) throw new Error("Phone already in use");
    user.phone = phone;
  }

  if (name) user.name = name;

  if (profile) {
    user.profile = user.profile || {};
    Object.assign(user.profile, profile);
  }

  await user.save();

  const { password: _pw, ...userData } = user.toObject();
  return userData;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
};

// ─── Superadmin user management ───────────────────────────────────────────────

export const getAllUsers = async ({ search, role, sort, order, page, limit }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role && ["user", "admin"].includes(role)) {
    query.role = role;
  }

  const sortField = ALLOWED_SORT.includes(sort) ? sort : "createdAt";
  const sortDir = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  return { users, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

export const getUserWithOrders = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .select("items totalAmount paymentStatus orderStatus createdAt");

  return { user, orders };
};

export const toggleBlockUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  user.isBlocked = !user.isBlocked;
  await user.save();
  return user;
};
