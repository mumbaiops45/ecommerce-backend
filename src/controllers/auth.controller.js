import { registerUser, loginUser } from "../services/auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const { user, token } = await registerUser({ name, email, phone, password });

    
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(201).json({ success: true, message: "Registered successfully", user ,token });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
        console.log("token",token);
    res.cookie("token", token, COOKIE_OPTIONS);
    return res.status(200).json({ success: true, message: "Logged in successfully", user, token });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
