import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      trim: true,
    },
       type: {
      type: String,
      enum: ["hero", "middle"],
      required: true,
      default: "hero",
    },

    link: {
      type: String,
      default: "",
      trim: true,
    },

    serialNo: {
      type: Number,
      required: true,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner ||
  mongoose.model("Banner", bannerSchema);