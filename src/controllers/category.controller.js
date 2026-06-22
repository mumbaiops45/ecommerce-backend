// src/controllers/category.controller.js
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";

// POST /api/categories
export const create = async (req, res) => {
  try {
    const { existingImage, ...rest } = req.body;
    const data = { ...rest };

    if (req.file) {
      data.image = req.file.path;   // Cloudinary URL
    }

    const category = await createCategory(data);
    return res.status(201).json({ success: true, category });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/categories
export const getAll = async (req, res) => {
  try {
    const result = await getAllCategories(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/categories/:id
export const getOne = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    return res.status(200).json({ success: true, category });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id
export const update = async (req, res) => {
  try {
    const { existingImage, ...rest } = req.body;
    const data = { ...rest };

    if (req.file) {
      // naya file aaya
      data.image = req.file.path;
    } else if (existingImage !== undefined) {
      // koi naya file nahi — jo user ne rakha (ya "" agar remove kiya)
      data.image = existingImage;
    }

    const category = await updateCategory(req.params.id, data);
    return res.status(200).json({ success: true, category });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/categories/:id
export const remove = async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    return res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};