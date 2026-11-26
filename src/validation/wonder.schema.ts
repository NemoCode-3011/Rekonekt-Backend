import { z } from "zod";
import { parseYouTubeVideoUrl } from "../utils/youtube";

// The kinds of hidden wonder. To add one, add it here and in the frontend's
// wonder types list. No database change is needed.
export const WONDER_TYPES = [
  "place",
  "landscape",
  "festival",
  "tradition",
  "food",
  "craft",
  "music",
  "architecture",
  "other",
] as const;

// Words the wonder routes already use, so a wonder cannot take them as a slug.
const RESERVED_SLUGS = ["admin"];

// Only normal web addresses. This keeps things like "javascript:..." out of links.
const webUrl = (message: string) =>
  z
    .string()
    .trim()
    .url(message)
    .refine((value) => /^https?:\/\//i.test(value), message);

const referenceSchema = z.object({
  label: z
    .string({ error: "Each link needs a label" })
    .trim()
    .min(2, "A link label must be at least 2 characters")
    .max(255, "A link label must not exceed 255 characters"),
  url: webUrl("Each link needs a valid web address starting with http or https"),
  note: z
    .string()
    .trim()
    .max(500, "A link note must not exceed 500 characters")
    .optional(),
});

const latitude = z
  .number({ error: "Latitude must be a number" })
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");

const longitude = z
  .number({ error: "Longitude must be a number" })
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

const title = z
  .string({ error: "Title is required" })
  .trim()
  .min(2, "Title must be at least 2 characters")
  .max(255, "Title must not exceed 255 characters");

const slug = z
  .string({ error: "Slug is required" })
  .min(2, "Slug must be at least 2 characters")
  .max(255, "Slug must not exceed 255 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must contain only lowercase letters, numbers, and hyphens",
  )
  .refine((value) => !RESERVED_SLUGS.includes(value), "This slug is reserved");

const wonderType = z.enum(WONDER_TYPES, {
  error: `Type must be one of: ${WONDER_TYPES.join(", ")}`,
});

const summary = z
  .string()
  .trim()
  .max(600, "Summary must not exceed 600 characters");

const region = z
  .string()
  .trim()
  .max(255, "Region must not exceed 255 characters");

const coverImageAlt = z
  .string()
  .max(255, "Image description must not exceed 255 characters");

const coverImageCredit = z
  .string()
  .max(500, "Image credit must not exceed 500 characters");

const coverImageUrl = webUrl("Invalid cover image URL");
// Only YouTube links are accepted, so the page can safely show them as an embedded video.
const videoUrl = z
  .string()
  .trim()
  .refine(
    (value) => parseYouTubeVideoUrl(value) !== null,
    "Use a YouTube link, for example https://www.youtube.com/watch?v=...",
  );

const pinIsComplete = (value: {
  latitude?: number | null;
  longitude?: number | null;
}) =>
  (value.latitude === undefined) === (value.longitude === undefined) &&
  (value.latitude === null) === (value.longitude === null);

const pinMessage = "Give both latitude and longitude, or neither";

export const createWonderSchema = z
  .object({
    title,
    slug,
    wonderType,
    summary: summary.optional(),
    content: z.string().optional(),
    region: region.optional(),
    latitude: latitude.optional(),
    longitude: longitude.optional(),
    coverImageUrl: coverImageUrl.optional(),
    coverImageAlt: coverImageAlt.optional(),
    coverImageCredit: coverImageCredit.optional(),
    videoUrl: videoUrl.optional(),
    references: z.array(referenceSchema).max(20, "Up to 20 links").optional(),
  })
  .refine(pinIsComplete, { message: pinMessage, path: ["latitude"] });

// Update: leave a field out to keep it, send null to clear it.
export const updateWonderSchema = z
  .object({
    title: title.optional(),
    slug: slug.optional(),
    wonderType: wonderType.optional(),
    summary: summary.nullable().optional(),
    content: z.string().nullable().optional(),
    region: region.nullable().optional(),
    latitude: latitude.nullable().optional(),
    longitude: longitude.nullable().optional(),
    coverImageUrl: coverImageUrl.nullable().optional(),
    coverImageAlt: coverImageAlt.nullable().optional(),
    coverImageCredit: coverImageCredit.nullable().optional(),
    videoUrl: videoUrl.nullable().optional(),
    // When sent, this list replaces the wonder's links completely.
    references: z.array(referenceSchema).max(20, "Up to 20 links").optional(),
  })
  .refine(pinIsComplete, { message: pinMessage, path: ["latitude"] });

export type WonderReferenceInput = z.infer<typeof referenceSchema>;
export type CreateWonderInput = z.infer<typeof createWonderSchema>;
export type UpdateWonderInput = z.infer<typeof updateWonderSchema>;