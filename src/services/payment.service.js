import Order from "../models/Order.model.js";
import razorpay from "../config/razorpay.js"
import crypto from "crypto";
import Cart from "../models/Cart.model.js";
import Coupon from "../models/Coupon.model.js";
import CouponUsage from "../models/CouponUsage.model.js";
import Product from "../models/Product.model.js";

export const createUserPaymentOrder = async (orderId) => {

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("Order already paid");
  }

  const options = {
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: order._id.toString()
  }

  const razorpayOrder = await razorpay.orders.create(options)
  order.razorpayOrderId = razorpayOrder.id;
  await order.save();
  return razorpayOrder
}

export const verifyUserPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  // 1. Prevent missing data
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Missing payment details");
  }
  // 1. Create signature string
  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  // 2. Generate expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  // 3. Compare signatures
  if (expectedSignature !== razorpay_signature) {
    throw new Error("Payment verification failed (Invalid signature)");
  }

  // 4. Find order using Razorpay order id
  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!order) {
    throw new Error("Order not found");
  }
if (order.paymentStatus === "paid") {
  return order;
}
  // 5. Update order status
  order.paymentStatus = "paid";
  order.orderStatus = "processing";
  order.razorpayPaymentId = razorpay_payment_id;


  const now = new Date();

  order.orderPlacedAt = now;

  const expectedDate = new Date(now);
  expectedDate.setDate(expectedDate.getDate() + 4);

  order.expectedDeliveryDate = expectedDate;
for (const item of order.items) {
  await Product.findByIdAndUpdate(item.product,
    {
      $inc:
      {
        stock:-item.quantity,
      }
    }
  )
  
}
  await order.save();

const usage =
  await CouponUsage.findOne({
    coupon: order.couponId,
    user: order.user,
  });

if (!usage) {
  await CouponUsage.create({
    coupon: order.couponId,
    user: order.user,
  });

  await Coupon.findByIdAndUpdate(
    order.couponId,
    {
      $inc: {
        usedCount: 1,
      },
    }
  );
}

  // 6. Clear cart
  //   await Cart.findOneAndUpdate(
  //     { user: order.user },
  //     { items: [] }
  //   );

  return order;
};