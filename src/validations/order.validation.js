import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z
          .string({ required_error: "Product ID is required" })
          .min(1, "Product ID is required"),

        quantity: z
          .number({ required_error: "Quantity is required" })
          .int("Quantity must be an integer")
          .min(1, "Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),

  shippingAddress: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(1, "Name is required"),

    phone: z
      .string({ required_error: "Phone is required" })
      .regex(/^\d{10}$/, "Phone must be a 10-digit number"),

    address: z
      .string({ required_error: "Address is required" })
      .trim()
      .min(1, "Address is required"),

    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(1, "City is required"),

    state: z
      .string({ required_error: "State is required" })
      .trim()
      .min(1, "State is required"),

    pincode: z
      .string({ required_error: "Pincode is required" })
      .regex(/^\d{6}$/, "Pincode must be 6 digits"),
  }),
});
