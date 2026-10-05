import { publicChild } from "./visibility";

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
  WHERE status = 'published'
  ORDER BY title ASC;
`;

export const getArtifactsBySectionQuery = `
  SELECT *
  FROM artifacts
  WHERE section_id = $1
    AND status = 'published'
  ORDER BY title ASC;
`;

export const getArtifactByIdQuery = `
  SELECT *
  FROM artifacts
  WHERE id = $1
    AND status = 'published';
`;

export const updateArtifactQuery = `
  UPDATE artifacts
  SET
    section_id = COALESCE($1, section_id),
    title = COALESCE($2, title),
    slug = COALESCE($3, slug),
    artifact_type = COALESCE($4, artifact_type),
    description = COALESCE($5, description),
    historical_context = COALESCE($6, historical_context),
    date_display = COALESCE($7, date_display),
    place_id = COALESCE($8, place_id),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $9
  RETURNING *;
`;

export const deleteArtifactQuery = `
  DELETE FROM artifacts
  WHERE id = $1
  RETURNING id, title, slug;
`;
export const getArtifactBySlugQuery = `
  SELECT *
  FROM artifacts
  WHERE slug = $1
    AND status = 'published';
`;