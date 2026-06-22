// src/services/category.service.js
import Category from "../models/Category.model.js";

// ─── CREATE ──────────────────────────────────────────────────
export const createCategory = async (data) => {
  const existing = await Category.findOne({
    name: { $regex: `^${data.name}$`, $options: "i" },
  });
  if (existing) throw new Error("Category with this name already exists");

  // FormData se aaya string "true"/"false" → boolean
  if (typeof data.isActive === "string") {
    data.isActive = data.isActive === "true";
  }

  const category = await Category.create(data);
  return category;
};

// ─── GET ALL ─────────────────────────────────────────────────
export const getAllCategories = async (query = {}) => {
  const { page = 1, limit = 10, sort = "name", order = "asc" } = query;
  const sortOrder = order === "desc" ? -1 : 1;
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Category.countDocuments({ isActive: true });

  const categories = await Category.find({ isActive: true })
    .sort({ [sort]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  return {
    categories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ─── GET BY ID ───────────────────────────────────────────────
export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category || !category.isActive) throw new Error("Category not found");
  return category;
};

// ─── UPDATE ──────────────────────────────────────────────────
export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  // string → boolean
  if (typeof data.isActive === "string") {
    data.isActive = data.isActive === "true";
  }

  Object.assign(category, data);
  await category.save();
  return category;
};

// ─── DELETE (soft) ───────────────────────────────────────────
export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!category) throw new Error("Category not found");
  return category;
};