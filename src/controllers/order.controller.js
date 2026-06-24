import {
  getAllOrders,
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderById
} from "../services/order.service.js";

export const getAllOrder = async (req, res) => {
  try {
    const result = await getAllOrders(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const placeOrder = async (req, res) => {
  try {

    const { items, shippingAddress ,couponCode,  paymentMethod } = req.body;

    const order = await createOrder(req.user._id, { items, shippingAddress , couponCode , paymentMethod});
    return res.status(201).json({ success: true, message: "Order placed", order });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user._id);
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.user._id, req.params.id);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    if (err.message === "Access denied") {
      return res.status(403).json({ success: false, message: err.message });
    }
    if (err.message === "Order not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};
export const updateSingleOrder = async (req, res) => {
  try {
  
   
    const order = await updateOrderById(req.user._id, req.params.id,req.body);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    if (err.message === "Access denied") {
      return res.status(403).json({ success: false, message: err.message });
    }
    if (err.message === "Order not found") {
      return res.status(404).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
};