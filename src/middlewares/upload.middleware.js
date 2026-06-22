import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getCloudinary } from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: getCloudinary(),   // ← yahan config trigger hoga, tab tak env load ho chuka hoga
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

export default upload;