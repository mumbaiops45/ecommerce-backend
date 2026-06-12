import mongoose from "mongoose";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";

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

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");
  cart.items = [];
  await cart.save();
  return cart;
};
