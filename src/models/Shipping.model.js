import mongoose from "mongoose";

const slabSchema = new mongoose.Schema(
  {
    minAmount: Number,
    maxAmount: Number,
    charge: Number,
  },
  { _id: false }
);

const stateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    mode: {
      type: String,
      enum: ["flat", "slab", "state", "both"],
      default: "flat",
    },

    calculationType: {
      type: String,
      enum: ["add", "override"],
      default: "add",
    },

    flatCharge: {
      type: Number,
      default: 0,
    },

    slabs: [slabSchema],

    states: [stateSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Shipping",
  shippingSchema
);