import { z } from "zod";

export const createMediaSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters"),

  mediaType: z
    .string({
      error: "Media type is required",
    })
    .min(2, "Media type is required")
    .max(50, "Media type must not exceed 50 characters"),

  fileUrl: z
    .string({
      error: "File URL is required",
    })
    .url("Invalid file URL"),

  caption: z
    .string()
    .optional(),

  description: z
    .string()
    .optional(),

  sourceCredit: z
    .string()
    .max(255, "Source credit must not exceed 255 characters")
    .optional(),

  license: z
    .string()
    .max(255, "License must not exceed 255 characters")
    .optional(),
});

export const updateMediaSchema =
  createMediaSchema.partial();