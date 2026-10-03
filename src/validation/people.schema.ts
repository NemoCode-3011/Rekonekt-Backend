import { z } from "zod";

export const createPersonSchema = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(150, "Name must not exceed 150 characters"),

  slug: z
    .string({
      error: "Slug is required",
    })
    .min(2, "Slug must be at least 2 characters")
    .max(150, "Slug must not exceed 150 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z
    .string()
    .optional(),

  birthDate: z
    .string()
    .date("Invalid birth date")
    .optional(),

  deathDate: z
    .string()
    .date("Invalid death date")
    .optional(),
});

export const updatePersonSchema =
  createPersonSchema.partial();