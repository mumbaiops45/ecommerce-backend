import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cart.service.js";

export const getUserCart = async (req, res) => {
  try {
    const cart = await getCart(req.user._id);
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await addToCart(req.user._id, { productId, quantity });
    return res
      .status(200)
      .json({ success: true, message: "Item added to cart", cart });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await updateCartItem(req.user._id, productId, quantity);
    return res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await removeFromCart(req.user._id, productId);
    return res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const clearUserCart = async (req, res) => {
  try {
    await clearCart(req.user._id);
    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
