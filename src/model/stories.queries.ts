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
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $10
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