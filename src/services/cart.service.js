import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

const populateCart = (userId) =>
  Cart.findOne({ user: userId }).populate(
    "items.product",
    "name price images brand"
  );

export const getCart = async (userId) => {
  const cart = await populateCart(userId);
  return cart || { items: [] };
};

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    const existing = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  return populateCart(userId);
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );
  if (!item) throw new Error("Item not in cart");

  item.quantity = quantity;
  await cart.save();

  return populateCart(userId);
};

export const removeFromCart = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const before = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === before) throw new Error("Item not in cart");

  await cart.save();
  return populateCart(userId);
};

export const getAllCarts = async ({ search, sort, order, page, limit } = {}) => {
  let userFilter;

  if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    userFilter = { user: { $in: matchingUsers.map((u) => u._id) } };
  }

  const query = userFilter || {};

  const allowedSort = ["createdAt", "updatedAt"];
  const sortField = allowedSort.includes(sort) ? sort : "createdAt";
  const sortDir = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [carts, total] = await Promise.all([
    Cart.find(query)
      .populate("user", "name email phone")
      .populate("items.product", "title price images brand")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limitNum),
    Cart.countDocuments(query),
  ]);

  return { carts, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");
  cart.items = [];
  await cart.save();
  return cart;
};
