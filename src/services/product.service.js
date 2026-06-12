// src/services/product.service.js
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";

const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);

// ─── CREATE ───────────────────────────────────────────────────────────────────
export const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

// ─── GET ALL (search + filter + sort + pagination) ───────────────────────────
export const getAllProducts = async (query) => {
  const {
    search,       // search by title or brand
    category,
    brand,
    minPrice,
    maxPrice,
    sort = "createdAt", // createdAt | price
    order = "desc",     // asc | desc  (use "low" or "high" aliases too)
    page = 1,
    limit = 10,
    isFeatured,
  } = query;

  const filter = { isActive: true };

  // Full-text style search on title and brand
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    if (isObjectId(category)) filter.category = category;
    else filter.category = null; // invalid ObjectId → no results
  }
  if (brand) filter.brand = { $regex: brand, $options: "i" };
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Sort mapping — accept "low"/"high" as aliases for price sort
  let sortField = sort;
  let sortOrder = order === "asc" || order === "low" ? 1 : -1;

  if (order === "low" || order === "high") sortField = "price";

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name image")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ─── GET SINGLE ───────────────────────────────────────────────────────────────
export const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name image");
  if (!product || !product.isActive) throw new Error("Product not found");
  return product;
};

// ─── UPDATE ───────────────────────────────────────────────────────────────────
export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new Error("Product not found");
  return product;
};

// ─── DELETE (soft delete) ─────────────────────────────────────────────────────
export const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!product) throw new Error("Product not found");
  return product;
};

const recalcReviews = (product) => {
  product.numReviews = product.reviews.length;
  product.averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;
};

// ─── ADD REVIEW ───────────────────────────────────────────────────────────────
export const addReview = async (productId, userId, reviewData) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new Error("Product not found");

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) throw new Error("You have already reviewed this product");

  product.reviews.push({ user: userId, ...reviewData });
  recalcReviews(product);
  await product.save();
  return product;
};

// ─── DELETE REVIEW ────────────────────────────────────────────────────────────
export const deleteReview = async (productId, userId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  product.reviews = product.reviews.filter(
    (r) => r.user.toString() !== userId.toString()
  );
  recalcReviews(product);
  await product.save();
  return product;
};

// ─── GET PRODUCTS BY CATEGORY ────────────────────────────────────────────────
export const getProductsByCategory = async (categoryId, query = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search,
    brand,
    minPrice,
    maxPrice,
  } = query;

  const cat = await Category.findById(categoryId);
  if (!cat || !cat.isActive) throw new Error("Category not found");

  const filter = { isActive: true, category: cat._id };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }
  if (brand) filter.brand = { $regex: brand, $options: "i" };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortField = sort;
  let sortOrder = order === "asc" || order === "low" ? 1 : -1;
  if (order === "low" || order === "high") sortField = "price";

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("category", "name image")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};