import {
  createRazorpayOrder,
  verifyPayment,
} from "../services/payment.service.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }
    const data = await createRazorpayOrder(req.user._id, orderId);
    return res.status(200).json({ success: true, ...data });
  } catch (err) {
    if (err.message === "Access denied") {
      return res.status(403).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const verifyPaymentSignature = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "razorpayOrderId, razorpayPaymentId and razorpaySignature are required",
      });
    }

    const order = await verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res
      .status(200)
      .json({ success: true, message: "Payment verified", order });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
