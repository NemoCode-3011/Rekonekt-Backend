import { z } from "zod";

export const createEventSchema = z.object({
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
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z
    .string()
    .optional(),

  eventDate: z
    .string()
    .date("Invalid event date")
    .optional(),

  dateDisplay: z
    .string()
    .max(100, "Date display must not exceed 100 characters")
    .optional(),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),
});

export const updateEventSchema = createEventSchema
  .omit({
    sectionId: true,
  })
  .partial();