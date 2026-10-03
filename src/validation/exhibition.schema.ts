import { z } from "zod";

export const createExhibitionSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters"),

  slug: z
    .string({
      error: "Slug is required",
    })
    .min(2, "Slug must be at least 2 characters")
    .max(255, "Slug must not exceed 255 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  subtitle: z
    .string()
    .max(255, "Subtitle must not exceed 255 characters")
    .optional(),

  description: z
    .string()
    .optional(),

  startDate: z
    .string()
    .date("Invalid start date"),

  endDate: z
    .string()
    .date("Invalid end date")
    .optional(),

  coverImageUrl: z
    .string()
    .url("Invalid cover image URL")
    .optional(),
});

export const updateExhibitionSchema =
  createExhibitionSchema.partial();