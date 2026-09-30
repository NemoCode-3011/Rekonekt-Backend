export const createMediaQuery = `
  INSERT INTO media (
    title,
    media_type,
    file_url,
    caption,
    description,
    source_credit,
    license
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

export const getMediaQuery = `
  SELECT *
  FROM media
  ORDER BY created_at DESC;
`;

export const getMediaByIdQuery = `
  SELECT *
  FROM media
  WHERE id = $1;
`;

export const updateMediaQuery = `
  UPDATE media
  SET
    title = $1,
    media_type = $2,
    file_url = $3,
    caption = $4,
    description = $5,
    source_credit = $6,
    license = $7,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *;
`;

export const deleteMediaQuery = `
  DELETE FROM media
  WHERE id = $1
  RETURNING id, title, media_type;
`;