import mongoose from "mongoose";

const slabSchema = new mongoose.Schema(
  {
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
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
      enum: ["flat", "state", "slab"],
      default: "flat",
    },

    flatCharge: {
      type: Number,
      default: 0,
    },

    freeShippingAbove: {
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