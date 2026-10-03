import { z } from "zod";

export const createProgressSchema = z.object({
  exhibitionId: z.number({
    error: "Exhibition ID is required",
  }).int().positive(),

  sectionId: z.number()
    .int()
    .positive()
    .optional(),

  completed: z.boolean().optional(),
});

export const updateProgressSchema = z.object({
  sectionId: z.number()
    .int()
    .positive()
    .optional(),

  completed: z.boolean().optional(),
});