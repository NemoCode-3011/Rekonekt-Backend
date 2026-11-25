import { publicStandalone } from "./visibility";

export const createWonderQuery = `
  INSERT INTO wonders (
    title, slug, wonder_type, summary, content, region,
    latitude, longitude,
    cover_image_url, cover_image_alt, cover_image_credit,
    video_url, status
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'draft')
  RETURNING *;
`;

// Every column is written, because the service merges the changes with the
// saved wonder first. 
export const updateWonderQuery = `
  UPDATE wonders
  SET
    title = $1,
    slug = $2,
    wonder_type = $3,
    summary = $4,
    content = $5,
    region = $6,
    latitude = $7,
    longitude = $8,
    cover_image_url = $9,
    cover_image_alt = $10,
    cover_image_credit = $11,
    video_url = $12,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $13
  RETURNING *;
`;

export const deleteWonderQuery = `
  DELETE FROM wonders
  WHERE id = $1
  RETURNING id, title, slug;
`;

// For the browse page: no body text, so the list stays light.
export const getPublishedWondersQuery = `
  SELECT w.id, w.title, w.slug, w.wonder_type, w.summary, w.region,
         w.latitude, w.longitude,
         w.cover_image_url, w.cover_image_alt, w.cover_image_credit,
         w.published_at
  FROM wonders w
  WHERE ${publicStandalone("w")}
    AND ($1::text IS NULL OR w.wonder_type = $1)
  ORDER BY w.published_at DESC NULLS LAST, w.id DESC;
`;

export const getWonderBySlugQuery = `
  SELECT w.*
  FROM wonders w
  WHERE w.slug = $1
    AND ${publicStandalone("w")};
`;

export const getWonderByIdQuery = `
  SELECT *
  FROM wonders
  WHERE id = $1;
`;

export const getWonderByIdForUpdateQuery = `
  SELECT *
  FROM wonders
  WHERE id = $1
  FOR UPDATE;
`;

export const getWonderReferencesQuery = `
  SELECT id, label, url, note, display_order
  FROM wonder_references
  WHERE wonder_id = $1
  ORDER BY display_order ASC, id ASC;
`;

export const deleteWonderReferencesQuery = `
  DELETE FROM wonder_references
  WHERE wonder_id = $1;
`;

export const insertWonderReferenceQuery = `
  INSERT INTO wonder_references (wonder_id, label, url, note, display_order)
  VALUES ($1, $2, $3, $4, $5);
`;