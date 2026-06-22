import { registerUser, loginUser } from "../services/auth.service.js";


export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const { user, token } = await registerUser({ name, email, phone, password });

    
   
    return res.status(201).json({ success: true, message: "Registered successfully", user ,token });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });


    return res.status(200).json({ success: true, message: "Logged in successfully", user, token });
  } catch (err) {
    return res.status(401).json({ success: false, message: err.message });
  }
};

