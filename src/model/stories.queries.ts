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
  ORDER BY created_at ASC;
`;

export const getStoryByIdQuery = `
  SELECT *
  FROM stories
  WHERE id = $1;
`;

export const updateStoryQuery = `
  UPDATE stories
  SET
    section_id = $1,
    title = $2,
    slug = $3,
    excerpt = $4,
    content = $5,
    cover_image_url = $6,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $7
  RETURNING *;
`;

export const deleteStoryQuery = `
  DELETE FROM stories
  WHERE id = $1
  RETURNING id, title, slug;
`;