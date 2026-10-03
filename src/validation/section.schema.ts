import { z } from "zod";

export const createSectionSchema = z.object({
  exhibitionId: z
    .number({
      error: "Exhibition ID is required",
    })
    .int("Exhibition ID must be an integer")
    .positive("Exhibition ID must be positive"),

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

  introduction: z
    .string()
    .optional(),

  sectionOrder: z
    .number({
      error: "Section order is required",
    })
    .int("Section order must be an integer")
    .positive("Section order must be positive"),

  heroImageUrl: z
    .string()
    .url("Invalid hero image URL")
    .optional(),
});

export const updateSectionSchema =
  createSectionSchema.omit({
    exhibitionId: true,
  }).partial();