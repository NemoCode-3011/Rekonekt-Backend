import { z } from "zod";

const positiveId = z.number().int().positive();
const displayOrder = z.number().int().min(0).optional().default(0);

export const sectionPersonSchema = z.object({
  personId: positiveId,
  displayOrder,
});

export const sectionPlaceSchema = z.object({
  placeId: positiveId,
  displayOrder,
});

export const relationshipIdSchema = z.coerce.number().int().positive();

export const sourceTargetTypeSchema = z.enum([
  "section",
  "story",
  "event",
  "person",
  "place",
  "artifact",
]);
