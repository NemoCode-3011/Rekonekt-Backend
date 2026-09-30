export const createArtifactQuery = `
  INSERT INTO artifacts (
    section_id,
    title,
    slug,
    artifact_type,
    description,
    historical_context,
    date_display,
    place_id
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;
`;

export const getArtifactsQuery = `
  SELECT *
  FROM artifacts
  ORDER BY title ASC;
`;

export const getArtifactsBySectionQuery = `
  SELECT *
  FROM artifacts
  WHERE section_id = $1
  ORDER BY title ASC;
`;

export const getArtifactByIdQuery = `
  SELECT *
  FROM artifacts
  WHERE id = $1;
`;

export const updateArtifactQuery = `
  UPDATE artifacts
  SET
    section_id = $1,
    title = $2,
    slug = $3,
    artifact_type = $4,
    description = $5,
    historical_context = $6,
    date_display = $7,
    place_id = $8,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $9
  RETURNING *;
`;

export const deleteArtifactQuery = `
  DELETE FROM artifacts
  WHERE id = $1
  RETURNING id, title, slug;
`;
