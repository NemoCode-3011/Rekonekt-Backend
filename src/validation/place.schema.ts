import { z } from "zod";

export const createPlaceSchema = z.object({
  name: z
    .string({
      error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),

  description: z
    .string()
    .optional(),

  latitude: z
    .number({
      error: "Latitude is required",
    })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  longitude: z
    .number({
      error: "Longitude is required",
    })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export const updatePlaceSchema =
  createPlaceSchema.partial();