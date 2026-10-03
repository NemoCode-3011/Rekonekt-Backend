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
    title = COALESCE($1, title),
    media_type = COALESCE($2, media_type),
    file_url = COALESCE($3, file_url),
    caption = COALESCE($4, caption),
    description = COALESCE($5, description),
    source_credit = COALESCE($6, source_credit),
    license = COALESCE($7, license),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *;
`;

export const deleteMediaQuery = `
  DELETE FROM media
  WHERE id = $1
  RETURNING id, title, media_type;
`;
