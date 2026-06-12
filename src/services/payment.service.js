import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.model.js";

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

export const createRazorpayOrder = async (userId, orderId) => {
  if (!orderId) throw new Error("Order ID is required");

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.user.toString() !== userId.toString()) {
    throw new Error("Access denied");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("Order is already paid");
  }

  const razorpay = getRazorpay();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${orderId}`,
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    key: process.env.RAZORPAY_KEY_ID,
  };
};

export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Invalid payment signature");
  }

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) throw new Error("Order not found");

  order.paymentStatus = "paid";
  order.orderStatus = "processing";
  order.razorpayPaymentId = razorpayPaymentId;
  await order.save();

  return order;
};
