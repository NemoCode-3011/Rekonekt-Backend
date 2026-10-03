import { z } from "zod";

export const createMediaAttachmentSchema = z.object({
  mediaId: z
    .number({
      error: "Media ID is required",
    })
    .int("Media ID must be an integer")
    .positive("Media ID must be positive"),

  exhibitionId: z
    .number()
    .int("Exhibition ID must be an integer")
    .positive("Exhibition ID must be positive")
    .optional(),

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

  placeId: z
    .number()
    .int("Place ID must be an integer")
    .positive("Place ID must be positive")
    .optional(),

  artifactId: z
    .number()
    .int("Artifact ID must be an integer")
    .positive("Artifact ID must be positive")
    .optional(),

  displayOrder: z
    .number()
    .int("Display order must be an integer")
    .min(0, "Display order cannot be negative")
    .optional(),
});

export const updateMediaAttachmentSchema =
  createMediaAttachmentSchema.partial();