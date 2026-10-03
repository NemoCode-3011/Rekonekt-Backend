import { z } from "zod";

export const addEventPersonSchema = z.object({
  eventId: z
    .number({
      error: "Event ID is required",
    })
    .int("Event ID must be an integer")
    .positive("Event ID must be positive"),

  personId: z
    .number({
      error: "Person ID is required",
    })
    .int("Person ID must be an integer")
    .positive("Person ID must be positive"),
});