export const getPublishedExhibitionsQuery = `
  SELECT
    id,
    title,
    slug,
    subtitle,
    description,
    start_date,
    end_date,
    cover_image_url,
    published_at
  FROM exhibitions
  WHERE status = 'published'
  ORDER BY published_at DESC;
`;

export const getExhibitionBySlugQuery = `
  SELECT
    id,
    title,
    slug,
    subtitle,
    description,
    start_date,
    end_date,
    cover_image_url,
    status,
    published_at
  FROM exhibitions
  WHERE slug = $1
    AND status = 'published';
`;

export const createExhibitionQuery = `
  INSERT INTO exhibitions (
    title,
    slug,
    subtitle,
    description,
    start_date,
    end_date,
    cover_image_url,
    status
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft')
  RETURNING *;
`;

export const publishExhibitionQuery = `
  UPDATE exhibitions
  SET
    status = 'published',
    published_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $1
  RETURNING *;
`;
export const deleteExhibitionQuery = `
  DELETE FROM exhibitions
  WHERE id = $1
  RETURNING id, title, slug;
`;


export const updateExhibitionQuery = `
  UPDATE exhibitions
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    subtitle = COALESCE($3, subtitle),
    description = COALESCE($4, description),
    start_date = COALESCE($5, start_date),
    end_date = COALESCE($6, end_date),
    cover_image_url = COALESCE($7, cover_image_url),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *;
`;