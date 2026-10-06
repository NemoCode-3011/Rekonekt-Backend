import { z } from "zod";

const targetFields = {
  sectionId: z.number().int().positive().nullable().optional(),
  eventId: z.number().int().positive().nullable().optional(),
  personId: z.number().int().positive().nullable().optional(),
  artifactId: z.number().int().positive().nullable().optional(),
  storyId: z.number().int().positive().nullable().optional(),
  placeId: z.number().int().positive().nullable().optional(),
};

const targetKeys = [
  "sectionId",
  "eventId",
  "personId",
  "artifactId",
  "storyId",
  "placeId",
] as const;

const targetCountIsValid = (
  value: Partial<Record<(typeof targetKeys)[number], number | null>>,
  context: z.RefinementCtx,
  requireTarget: boolean,
) => {
  const specified = targetKeys.some((key) => value[key] !== undefined);
  const targetCount = targetKeys.filter((key) => value[key] != null).length;

  if ((requireTarget || specified) && targetCount !== 1) {
    context.addIssue({
      code: "custom",
      message: "Exactly one content target is required",
    });
  }
};

const sourceLinkSchema = z.object({
  sourceId: z.number().int().positive(),
  ...targetFields,
  relationship: z.string().min(2).max(50),
  displayOrder: z.number().int().min(0).optional(),
});

export const createSourceLinkSchema = sourceLinkSchema.superRefine(
  (value, context) => targetCountIsValid(value, context, true),
);

export const updateSourceLinkSchema = sourceLinkSchema
  .partial()
  .extend({
    relationship: z.string().min(2).max(50).optional(),
  })
  .superRefine((value, context) => targetCountIsValid(value, context, false));
