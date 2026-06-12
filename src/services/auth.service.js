import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async ({ name, email, phone, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    throw new Error(existing.email === email ? "Email already registered" : "Phone already registered");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, phone, password: hashed, role: "user" });

  const token = generateToken({ id: user._id, role: user.role });
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const loginUser = async ({ email, password }) => {
  // Superadmin is env-only, not in the database
  if (
    email === process.env.SUPER_ADMIN_EMAIL &&
    password === process.env.SUPER_ADMIN_PASSWORD
  ) {
    const token = generateToken({ id: "superadmin", role: "superadmin", email });
    return {
      user: { id: "superadmin", name: "Super Admin", email, role: "superadmin" },
      token,
    };
  }

  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = generateToken({ id: user._id, role: user.role, email: user.email });
  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};
