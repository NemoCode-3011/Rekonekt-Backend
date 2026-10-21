import { publicChild } from "./visibility";

export const createStoryQuery = `
  INSERT INTO stories (
    section_id,
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    category,
    did_you_know,
    cover_image_alt,
    cover_image_credit,
    status
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'draft')
  RETURNING *;
`;

export const getStoriesBySectionQuery = `
  SELECT s.*
  FROM stories s
  WHERE s.section_id = $1
    AND ${publicChild("s")}
  ORDER BY s.created_at ASC;
`;

export const getStoryBySlugQuery = `
  SELECT s.id, s.section_id, s.title, s.slug, s.excerpt, s.content,
         s.cover_image_url, s.cover_image_alt, s.cover_image_credit,
         s.category, s.did_you_know, s.published_at
  FROM stories s
  WHERE s.slug = $1
    AND ${publicChild("s")};
`;

export const getAllStoriesBySectionQuery = `
  SELECT *
  FROM stories
  WHERE section_id = $1
  ORDER BY created_at ASC;
`;

export const getStoryByIdQuery = `
  SELECT *
  FROM stories
  WHERE id = $1;
`;

export const getPublishedStoriesQuery = `
  SELECT s.id, s.title, s.slug, s.excerpt, s.category, s.cover_image_url,
         s.cover_image_alt, s.cover_image_credit, s.published_at
  FROM stories s
  WHERE ${publicChild("s")}
  ORDER BY s.published_at DESC;
`;

// One published story for the home page's "Did you know?" section.
// It needs a snippet and a picture. The pick changes once a day, but
// stays the same for everyone during that day.
export const getDidYouKnowStoryQuery = `
  SELECT s.id, s.title, s.slug, s.category, s.did_you_know,
         s.cover_image_url, s.cover_image_alt, s.cover_image_credit
  FROM stories s
  WHERE ${publicChild("s")}
    AND s.did_you_know IS NOT NULL
    AND btrim(s.did_you_know) <> ''
    AND s.cover_image_url IS NOT NULL
  ORDER BY md5(s.slug || CURRENT_DATE::text)
  LIMIT 1;
`;

export const updateStoryQuery = `
  UPDATE stories
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    excerpt = COALESCE($3, excerpt),
    content = COALESCE($4, content),
    cover_image_url = COALESCE($5, cover_image_url),
    category = COALESCE($6, category),
    did_you_know = COALESCE($7, did_you_know),
    cover_image_alt = COALESCE($8, cover_image_alt),
    cover_image_credit = COALESCE($9, cover_image_credit),
    -- $10 says whether to touch the chapter at all. $11 is the new chapter,
    -- and NULL disconnects the story from its exhibition.
    section_id = CASE WHEN $10::boolean THEN $11::int ELSE section_id END,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $12
  RETURNING *;
`;

export const deleteStoryQuery = `
  DELETE FROM stories
  WHERE id = $1
  RETURNING id, title, slug;
`;

export const publishStoryQuery = `
  UPDATE stories
  SET
    status = 'published',
    published_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *;
`;

// The admin list: every story, drafts included, with the exhibition and chapter
// it is connected to (both are NULL for a standalone story).
// $1 is an optional chapter, to list only that chapter's stories.
export const getAdminStoriesQuery = `
  SELECT s.*,
         sec.title AS section_title,
         e.id AS exhibition_id,
         e.title AS exhibition_title
  FROM stories s
  LEFT JOIN sections sec ON sec.id = s.section_id
  LEFT JOIN exhibitions e ON e.id = sec.exhibition_id
  WHERE ($1::int IS NULL OR s.section_id = $1)
  ORDER BY s.updated_at DESC, s.id DESC;
`;

export const getAdminStoryByIdQuery = `
  SELECT s.*,
         sec.title AS section_title,
         e.id AS exhibition_id,
         e.title AS exhibition_title
  FROM stories s
  LEFT JOIN sections sec ON sec.id = s.section_id
  LEFT JOIN exhibitions e ON e.id = sec.exhibition_id
  WHERE s.id = $1;
`;