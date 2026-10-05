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
  SELECT *
  FROM stories
  WHERE section_id = $1
    AND status = 'published'
  ORDER BY created_at ASC;
`;

export const getDiscoveryStoryQuery = `
  SELECT id, title, slug, excerpt, cover_image_url, published_at
  FROM stories
  WHERE status = 'published'
    AND is_discovery = TRUE
  ORDER BY published_at DESC
  LIMIT 1;
`;

export const getStoryBySlugQuery = `
  SELECT id, section_id, title, slug, excerpt, content,
         cover_image_url, is_discovery, published_at
  FROM stories
  WHERE slug = $1
    AND status = 'published';
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
  SELECT id, title, slug, excerpt, cover_image_url, published_at
  FROM stories
  WHERE status = 'published'
  ORDER BY published_at DESC;
`;

export const updateStoryQuery = `
  UPDATE stories
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    excerpt = COALESCE($3, excerpt),
    content = COALESCE($4, content),
    cover_image_url = COALESCE($5, cover_image_url),
    is_discovery = COALESCE($6, is_discovery),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $7
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
