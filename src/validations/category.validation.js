import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").trim(),
  description: z.string().optional().default(""),
  image: z.string().url("Image must be a valid URL").optional().default(""),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").trim().optional(),
  description: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
  isActive: z.boolean().optional(),
});
