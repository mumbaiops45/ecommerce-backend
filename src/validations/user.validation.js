import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase(),

  phone: z
    .string({ required_error: "Phone is required" })
    .regex(/^\d{10}$/, "Phone must be a 10-digit number"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),

  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be a 10-digit number")
    .optional(),

  profile: z
    .object({
      avatar: z.string().optional(),
      gender: z.string().optional(),
      dateOfBirth: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z
        .string()
        .regex(/^\d{6}$/, "Pincode must be 6 digits")
        .optional(),
    })
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password is required" })
    .min(1, "Current password is required"),

  newPassword: z
    .string({ required_error: "New password is required" })
    .min(6, "New password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
