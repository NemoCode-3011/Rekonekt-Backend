import { publicChild } from "./visibility";

export const createStoryQuery = `
  INSERT INTO stories (
    section_id,
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    status
  )
  VALUES ($1, $2, $3, $4, $5, $6, 'draft')
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
         s.cover_image_url, s.published_at
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
  SELECT s.id, s.title, s.slug, s.excerpt, s.cover_image_url, s.published_at
  FROM stories s
  WHERE ${publicChild("s")}
  ORDER BY s.published_at DESC;
`;

export const updateStoryQuery = `
  UPDATE stories
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    excerpt = COALESCE($3, excerpt),
    content = COALESCE($4, content),
    cover_image_url = COALESCE($5, cover_image_url),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
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
