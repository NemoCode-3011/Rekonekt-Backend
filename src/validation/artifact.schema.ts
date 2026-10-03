import { z } from "zod";

export const createArtifactSchema = z.object({
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

  artifactType: z
    .string({
      error: "Artifact type is required",
    })
    .min(2, "Artifact type must be at least 2 characters")
    .max(100, "Artifact type must not exceed 100 characters"),

  description: z
    .string()
    .optional(),

  historicalContext: z
    .string()
    .optional(),

  dateDisplay: z
    .string()
    .max(100, "Date display must not exceed 100 characters")
    .optional(),

  placeId: z
    .number()
    .int("Place ID must be an integer")
    .positive("Place ID must be positive")
    .optional(),
});

export const updateArtifactSchema =
  createArtifactSchema.partial();