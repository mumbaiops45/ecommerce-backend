import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

const ALLOWED_SORT = ["createdAt", "totalAmount"];

export const getAllOrders = async ({
  search,
  orderStatus,
  paymentStatus,
  sort,
  order,
  page,
  limit,
} = {}) => {
  const query = {};

  if (orderStatus) query.orderStatus = orderStatus;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  if (search) {
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");
    query.user = { $in: matchingUsers.map((u) => u._id) };
  }

  const sortField = ALLOWED_SORT.includes(sort) ? sort : "createdAt";
  const sortDir = order === "asc" ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("user", "name email phone")
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  return { orders, total, page: pageNum, totalPages: Math.ceil(total / limitNum) };
};

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
      name: product.title,
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
export const updateOrderById = async (userId, orderId,data) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findByIdAndUpdate(orderId,data,{new:true,runValidators:true});
  if (!order) throw new Error("Order not found");

  if (order.user.toString() !== userId.toString()) {
    throw new Error("Access denied");
  }



  return order;
};
