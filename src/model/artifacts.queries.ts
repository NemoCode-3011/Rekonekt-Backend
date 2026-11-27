import { publicChild } from "./visibility";
import { bundleQuery, firstImage } from "./bundleShape";

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
  SELECT a.*
  FROM artifacts a
  WHERE ${publicChild("a")}
  ORDER BY a.title ASC;
`;

export const getArtifactsBySectionQuery = `
  SELECT a.*
  FROM artifacts a
  WHERE a.section_id = $1
    AND ${publicChild("a")}
  ORDER BY a.title ASC;
`;

export const getArtifactByIdQuery = `
  SELECT a.*
  FROM artifacts a
  WHERE a.id = $1
    AND ${publicChild("a")};
`;

// $9 is the list of fields the request sent. Only those can be cleared.
export const updateArtifactQuery = `
  UPDATE artifacts
  SET
    section_id = CASE WHEN 'sectionId' = ANY($9::text[]) THEN $1 ELSE section_id END,
    title = COALESCE($2, title),
    slug = COALESCE($3, slug),
    artifact_type = COALESCE($4, artifact_type),
    description = CASE WHEN 'description' = ANY($9::text[]) THEN $5 ELSE description END,
    historical_context = CASE WHEN 'historicalContext' = ANY($9::text[]) THEN $6 ELSE historical_context END,
    date_display = CASE WHEN 'dateDisplay' = ANY($9::text[]) THEN $7 ELSE date_display END,
    place_id = CASE WHEN 'placeId' = ANY($9::text[]) THEN $8 ELSE place_id END,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $10
  RETURNING *;
`;

export const deleteArtifactQuery = `
  DELETE FROM artifacts
  WHERE id = $1
  RETURNING id, title, slug;
`;
export const getArtifactBySlugQuery = `
  SELECT a.*
  FROM artifacts a
  WHERE a.slug = $1
    AND ${publicChild("a")};
`;
// Artifacts belong directly to one chapter (artifacts.section_id).
export const getArtifactBundlesQuery = bundleQuery(`
  SELECT
    s.exhibition_id,
    a.id,
    a.slug,
    a.title,
    ${firstImage("artifact_id", "a")} AS image_url,
    s.section_order,
    0 AS item_order
  FROM artifacts a
  JOIN sections s ON s.id = a.section_id
  WHERE ${publicChild("a")}
`);
