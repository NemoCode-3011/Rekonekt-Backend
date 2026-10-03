import { z } from "zod";

export const addEventPlaceSchema = z.object({
  eventId: z
    .number({
      error: "Event ID is required",
    })
    .int("Event ID must be an integer")
    .positive("Event ID must be positive"),

  placeId: z
    .number({
      error: "Place ID is required",
    })
    .int("Place ID must be an integer")
    .positive("Place ID must be positive"),
});