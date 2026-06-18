import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },

  discountType: {
    type: String,
    enum: ["fixed", "percentage"],
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

  minimumOrderAmount: {
    type: Number,
    default: 0,
  },

  maximumDiscountAmount: {
    type: Number,
    default: null,
  },
    // Total number of times this coupon can be used
  useLimit: {
    type: Number,
    default: 1,
  },

  // How many times it has already been used
  usedCount: {
    type: Number,
    default: 0,
  },


  expiresAt: {
    type: Date,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});
export default mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema);