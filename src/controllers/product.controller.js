
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  getProductsByCategory,
} from "../services/product.service.js";

// POST /api/products
export const create = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};  

// GET /api/products
// Query params: search, category, brand, minPrice, maxPrice,
//               sort, order (asc/desc/low/high), page, limit, isFeatured
export const getAll = async (req, res) => {
  try {
    const result = await getAllProducts(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/products/:id
export const getOne = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

// PUT /api/products/:id
export const update = async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id  (soft delete)
export const remove = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

// POST /api/products/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await addReview(req.params.id, req.user._id, {
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
    return res.status(201).json({ success: true, product });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/products/:id/reviews
export const deleteProductReview = async (req, res) => {
  try {
    const product = await deleteReview(req.params.id, req.user._id);
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET /api/products/category/:categoryId
// Query params: page, limit, sort, order, search, brand, minPrice, maxPrice
export const getByCategory = async (req, res) => {
  try {
    const result = await getProductsByCategory(req.params.categoryId, req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    const status = err.message === "Category not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};