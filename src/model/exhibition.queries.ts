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
    title = $1,
    slug = $2,
    subtitle = $3,
    description = $4,
    start_date = $5,
    end_date = $6,
    cover_image_url = $7,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *;
`;