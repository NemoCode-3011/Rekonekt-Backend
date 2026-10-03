import { z } from "zod";

export const createBookmarkSchema = z.object({
  artifactId: z.number({
    error: "Artifact ID is required",
  }).int().positive(),
});