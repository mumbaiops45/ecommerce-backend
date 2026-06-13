import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

const ALLOWED_SORT = ["createdAt", "name", "email"];

export const getAllAdmins = async ({ search, sort, order, page, limit } = {}) => {
  const query = { role: "admin" };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const sortField = ALLOWED_SORT.includes(sort) ? sort : "createdAt";
  const sortDir = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [admins, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  return { admins, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

export const createAdmin = async ({ name, email, phone, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    throw new Error(
      existing.email === email ? "Email already in use" : "Phone already in use"
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, phone, password: hashed, role: "admin" });

  const { password: _pw, ...adminData } = admin.toObject();
  return adminData;
};

export const updateAdmin = async (id, { name, email, phone }) => {
  const admin = await User.findOne({ _id: id, role: "admin" });
  if (!admin) return null;

  if (email && email !== admin.email) {
    const taken = await User.findOne({ email, _id: { $ne: id } });
    if (taken) throw new Error("Email already in use");
    admin.email = email;
  }

  if (phone && phone !== admin.phone) {
    const taken = await User.findOne({ phone, _id: { $ne: id } });
    if (taken) throw new Error("Phone already in use");
    admin.phone = phone;
  }

  if (name) admin.name = name;

  await admin.save();

  const { password: _pw, ...adminData } = admin.toObject();
  return adminData;
};

export const toggleDeactivateAdmin = async (id) => {
  const admin = await User.findOne({ _id: id, role: "admin" }).select("-password");
  if (!admin) return null;

  admin.isBlocked = !admin.isBlocked;
  await admin.save();
  return admin;
};

export const deleteAdmin = async (id) => {
  const admin = await User.findOneAndDelete({ _id: id, role: "admin" });
  return admin;
};
