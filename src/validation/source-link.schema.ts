import { z } from "zod";

export const createSourceLinkSchema = z.object({
  sourceId: z
    .number({
      error: "Source ID is required",
    })
    .int("Source ID must be an integer")
    .positive("Source ID must be positive"),

  sectionId: z
    .number()
    .int("Section ID must be an integer")
    .positive("Section ID must be positive")
    .optional(),

  eventId: z
    .number()
    .int("Event ID must be an integer")
    .positive("Event ID must be positive")
    .optional(),

  personId: z
    .number()
    .int("Person ID must be an integer")
    .positive("Person ID must be positive")
    .optional(),

  artifactId: z
    .number()
    .int("Artifact ID must be an integer")
    .positive("Artifact ID must be positive")
    .optional(),

  relationship: z
    .string({
      error: "Relationship is required",
    })
    .min(2, "Relationship must be at least 2 characters")
    .max(255, "Relationship must not exceed 255 characters"),

  displayOrder: z
    .number()
    .int("Display order must be an integer")
    .min(0, "Display order cannot be negative")
    .optional(),
});

export const updateSourceLinkSchema =
  createSourceLinkSchema.partial();