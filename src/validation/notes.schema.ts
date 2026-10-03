import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string({
    error: "Title is required",
  }).min(2).max(255),

  content: z.string({
    error: "Content is required",
  }).min(1, "Content is required"),

  noteDate: z.string()
    .date("Invalid note date")
    .optional(),
});

export const updateNoteSchema = createNoteSchema.partial();