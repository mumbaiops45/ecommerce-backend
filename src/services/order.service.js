import mongoose from "mongoose";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";
import Coupon from "../models/Coupon.model.js";
import CouponUsage from "../models/CouponUsage.model.js";
import Shipping from "../models/Shipping.model.js";

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

export const createOrder = async (userId, { items, shippingAddress, couponCode }) => {
  
  const orderItems = [];
  let subtotal = 0;
  let discountAmount = 0;
  let coupon = null;
  let shippingCharge = 0;

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

    subtotal += product.price * item.quantity;
  }

  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true
    })
    if (!coupon) {
      throw new Error("coupon not exist");
    };
    if (coupon.usedCount >= coupon.useLimit) {
      throw new Error("Coupon usage limit reached");
    }
    if (coupon.expiresAt < new Date()) {
      throw new Error("Coupon expired");
    }
    if (
      subtotal <
      coupon.minimumOrderAmount
    ) {
      throw new Error(
        `Minimum order is ₹${coupon.minimumOrderAmount}`
      );
    }
    const alreadyUsed = await CouponUsage.findOne({
      coupon: coupon._id,
      user: userId
    })
    if (alreadyUsed) {
      throw new Error(
        "You have already used this coupon"
      );
    }
    if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    } else {
      discountAmount = (subtotal * coupon.discountValue) / 100
    }

    if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
      discountAmount = coupon.maximumDiscountAmount;

    }
  };


  discountAmount = Math.min(
    discountAmount,
    subtotal
  );
  if (shippingAddress) {
    const shippingDetail = await Shipping.findOne({
      isActive: true
    });

    if (!shippingDetail) {
      throw new Error("Shipping configuration not found");
    }

    if (subtotal >= shippingDetail.freeShippingAbove) {
      shippingCharge = 0;
    } else {
      if (shippingDetail.mode === "flat") {
        shippingCharge = shippingDetail.flatCharge;
      }
      if (shippingDetail.mode === "state") {
        const data = shippingDetail.states.find((s) => s.state.toLowerCase() === shippingAddress.state.toLowerCase());
        if (!data) {
          throw new Error(
            `Shipping not available for ${shippingAddress.state}`
          );
        }

        shippingCharge = data?.charge || 0;
      }
      if (shippingDetail.mode === "slab") {
        const data = shippingDetail.slabs.find((s) =>
          s.minAmount <= subtotal && s.maxAmount >= subtotal
        );
        if (!data) {
          throw new Error(
            "No shipping slab configured for this order amount"
          );
        }

        shippingCharge = data?.charge || 0;
      }
    }

  }
  const totalAmount = subtotal - discountAmount + shippingCharge;
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    discountAmount,
    shippingAmount:shippingCharge,
    couponCode: couponCode || "",
    couponId: coupon?._id || null,
    totalAmount
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
export const updateOrderById = async (userId,
  orderId,
  data
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  // Delivered
  if (data.orderStatus === "delivered") {
    data.deliveredAt = new Date();
  }

  // Changed back from delivered
  if (
    data.orderStatus &&
    data.orderStatus !== "delivered"
  ) {
    data.deliveredAt = null;
  }

  // Cancelled
  if (data.orderStatus === "cancelled") {
    data.expectedDeliveryDate = null;
    data.deliveredAt = null;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};