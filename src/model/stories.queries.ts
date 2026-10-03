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
