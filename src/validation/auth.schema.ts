import { z } from "zod";

// Every email is trimmed and lowercased here, so cap letters and small ass letters for emails
// are the same address everywhere the backend uses a schema.
const emailField = z.string().trim().toLowerCase().email("Invalid email address");

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),

  email: emailField,
  password: z.string().min(8, "Password must be at least 8 characters"),
  preferredLanguage: z.string().optional(),
});

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: emailField,

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export const resendOtpSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z.object({
  email: emailField,

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),

  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),

  preferredLanguage: z.enum(["en", "yo", "ig", "ha"]),

  // null means "no cultural group"
  culturalGroupId: z.number().int().positive().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const createAdminSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),
  email: emailField,
  preferredLanguage: z.enum(["en", "yo", "ig", "ha"]).optional(),
});

export const setupAdminPasswordSchema = z.object({
  token: z.string().min(32, "Invalid or expired setup link"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});