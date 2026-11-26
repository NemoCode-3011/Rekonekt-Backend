import { z } from "zod";

// Nigeria's 36 states and the capital, plus a choice for places elsewhere
// (for example, museums abroad that hold Nigerian heritage). A fixed list keeps
// spelling the same, so "Osun" and "Osun State" never become two regions.
export const PLACE_REGIONS = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Outside Nigeria",
] as const;

// The kinds of place visitors can browse by. To add one, add it here and in the
// frontend's place categories list. No database change is needed.
export const PLACE_CATEGORIES = [
  "sacred-site",
  "palace",
  "market",
  "museum",
  "landscape",
  "monument",
  "historic-town",
  "festival-ground",
  "other",
] as const;

// Only normal web addresses, so things like "javascript:..." never become links.
const webUrl = (message: string) =>
  z
    .string()
    .trim()
    .url(message)
    .refine((value) => /^https?:\/\//i.test(value), message);

const name = z
  .string({ error: "Name is required" })
  .min(2, "Name must be at least 2 characters")
  .max(255, "Name must not exceed 255 characters");

const slug = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(255, "Slug must not exceed 255 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens",
  );

const summary = z
  .string()
  .trim()
  .max(600, "Summary must not exceed 600 characters");

const region = z.enum(PLACE_REGIONS, { error: "Choose a region from the list" });

const category = z.enum(PLACE_CATEGORIES, {
  error: `Category must be one of: ${PLACE_CATEGORIES.join(", ")}`,
});

const coverImageUrl = webUrl("Invalid cover image URL");

const coverImageAlt = z
  .string()
  .max(255, "Image description must not exceed 255 characters");

const coverImageCredit = z
  .string()
  .max(500, "Image credit must not exceed 500 characters");

const latitude = z
  .number({ error: "Latitude is required" })
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");

const longitude = z
  .number({ error: "Longitude is required" })
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

export const createPlaceSchema = z.object({
  name,
  // Left out, the slug is made from the name.
  slug: slug.optional(),
  description: z.string().optional(),
  summary: summary.optional(),
  region: region.optional(),
  category: category.optional(),
  latitude,
  longitude,
  coverImageUrl: coverImageUrl.optional(),
  coverImageAlt: coverImageAlt.optional(),
  coverImageCredit: coverImageCredit.optional(),
});

// Update: leave a field out to keep it, send null to clear it.
// Name, latitude and longitude can be changed but never emptied.
export const updatePlaceSchema = z.object({
  name: name.optional(),
  slug: slug.optional(),
  description: z.string().nullable().optional(),
  summary: summary.nullable().optional(),
  region: region.nullable().optional(),
  category: category.nullable().optional(),
  latitude: latitude.optional(),
  longitude: longitude.optional(),
  coverImageUrl: coverImageUrl.nullable().optional(),
  coverImageAlt: coverImageAlt.nullable().optional(),
  coverImageCredit: coverImageCredit.nullable().optional(),
});

export type CreatePlaceInput = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceInput = z.infer<typeof updatePlaceSchema>;