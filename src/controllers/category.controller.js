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
    const category = await createCategory(req.body);
    return res.status(201).json({ success: true, category });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/categories
// Query params: page, limit, sort, order (asc/desc)
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
    const category = await updateCategory(req.params.id, req.body);
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
