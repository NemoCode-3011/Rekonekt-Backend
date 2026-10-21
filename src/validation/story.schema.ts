import { z } from "zod";

// The kinds of story. To add a new one, add it here and in the frontend's
// features/stories/categories.ts (no database change is needed).
export const STORY_CATEGORIES = [
  "mythology",
  "folklore",
  "legend",
  "oral-history",
  "proverb",
  "tradition",
] as const;

// These words are already used by story routes, so a story cannot use them as a slug.
const RESERVED_SLUGS = ["did-you-know", "admin", "sections"];

export const createStorySchema = z.object({
  // Leave it out for a standalone story (mythology, folklore...) that
  // does not belong to an exhibition chapter.
  sectionId: z
    .number()
    .int("Section ID must be an integer")
    .positive("Section ID must be positive")
    .optional(),

  title: z
    .string({
      error: "Title is required",
    })
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title must not exceed 255 characters"),

  slug: z
    .string({
      error: "Slug is required",
    })
    .min(2, "Slug must be at least 2 characters")
    .max(255, "Slug must not exceed 255 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    )
    .refine((slug) => !RESERVED_SLUGS.includes(slug), "This slug is reserved"),

  excerpt: z.string().optional(),

  content: z
    .string({
      error: "Content is required",
    })
    .min(1, "Content is required"),

  coverImageUrl: z.string().url("Invalid cover image URL").optional(),

  category: z
    .enum(STORY_CATEGORIES, {
      error: `Category must be one of: ${STORY_CATEGORIES.join(", ")}`,
    })
    .optional(),

  // One or two sentences pulled from the story. Shown on the home page.
  didYouKnow: z
    .string()
    .min(10, "Did you know must be at least 10 characters")
    .max(300, "Did you know must not exceed 300 characters")
    .optional(),

  coverImageAlt: z
    .string()
    .max(255, "Image description must not exceed 255 characters")
    .optional(),

  coverImageCredit: z
    .string()
    .max(500, "Image credit must not exceed 500 characters")
    .optional(),
      // Second picture: the tall one for the home page's "Did you know?" section.
  didYouKnowImageUrl: z.string().url("Invalid image URL").optional(),
  
  didYouKnowImageAlt: z
    .string()
    .max(255, "Image description must not exceed 255 characters")
    .optional(),

  didYouKnowImageCredit: z
    .string()
    .max(500, "Image credit must not exceed 500 characters")
    .optional(),

  // Third picture: shown inside the story.
  bodyImageUrl: z.string().url("Invalid image URL").optional(),
  bodyImageAlt: z
    .string()
    .max(255, "Image description must not exceed 255 characters")
    .optional(),
  bodyImageCredit: z
    .string()
    .max(500, "Image credit must not exceed 500 characters")
    .optional(),
});

export const updateStorySchema = createStorySchema
  .omit({ sectionId: true })
  .partial()
  .extend({
    // A number connects the story to an exhibition chapter.
    // null disconnects it, which makes it a standalone story.
    sectionId: z
      .number()
      .int("Section ID must be an integer")
      .positive("Section ID must be positive")
      .nullable()
      .optional(),
  });