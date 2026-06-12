import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (userId, { items, shippingAddress }) => {
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    if (!mongoose.Types.ObjectId.isValid(item.productId)) {
      throw new Error(`Invalid product ID: ${item.productId}`);
    }

    const product = await Product.findById(item.productId);
    if (!product || !product.isActive) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const image =
      product.images && product.images.length > 0
        ? product.images[0].url || product.images[0]
        : "";

    orderItems.push({
      product: product._id,
      name: product.name,
      image,
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    totalAmount,
  });

  return order;
};

export const getUserOrders = async (userId) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (userId, orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.user.toString() !== userId.toString()) {
    throw new Error("Access denied");
  }

  return order;
};
