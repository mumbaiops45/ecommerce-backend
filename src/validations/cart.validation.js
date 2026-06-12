import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z
    .string({ required_error: "Product ID is required" })
    .min(1, "Product ID is required"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});
