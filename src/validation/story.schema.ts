import { z } from "zod";

export const createStorySchema = z.object({
  sectionId: z
    .number({
      error: "Section ID is required",
    })
    .int("Section ID must be an integer")
    .positive("Section ID must be positive"),

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
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  excerpt: z.string().optional(),

  content: z
    .string({
      error: "Content is required",
    })
    .min(1, "Content is required"),

  coverImageUrl: z.string().url("Invalid cover image URL").optional(),
});

export const updateStorySchema = createStorySchema.omit({ sectionId: true }).partial();
