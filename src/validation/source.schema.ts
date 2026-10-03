import { z } from "zod";

export const createSourceSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters"),

  author: z
    .string()
    .max(255, "Author must not exceed 255 characters")
    .optional(),

  publication: z
    .string()
    .max(255, "Publication must not exceed 255 characters")
    .optional(),

  sourceType: z
    .string({
      error: "Source type is required",
    })
    .min(2, "Source type must be at least 2 characters")
    .max(100, "Source type must not exceed 100 characters"),

  publicationDate: z
    .string()
    .date("Invalid publication date")
    .optional(),

  url: z
    .string()
    .url("Invalid source URL")
    .optional(),

  citation: z
    .string()
    .optional(),

  rightsStatement: z
    .string()
    .optional(),

  perspectiveNote: z
    .string()
    .optional(),
});

export const updateSourceSchema =
  createSourceSchema.partial();