
import { createUserPaymentOrder,verifyUserPayment } from "../services/payment.service.js";
export const createPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const razorpayOrder = await createUserPaymentOrder(orderId);
        return res.status(200).json({ success: true, razorpayOrder });
    } catch (err) {
        console.error("PAYMENT ERROR:", err);
        return res.status(400).json({ success: false, message: err.message });
    }

}
export const verifyPayment = async (req, res) => {
    try {
        const data = await verifyUserPayment(req.body);

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
