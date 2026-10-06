export const createSourceLinkQuery = `
  INSERT INTO source_links (
    source_id,
    section_id,
    event_id,
    person_id,
    artifact_id,
    story_id,
    place_id,
    relationship,
    display_order
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`;

export const getSourceLinksQuery = `
  SELECT *
  FROM source_links
  ORDER BY display_order ASC, created_at ASC;
`;

export const getSourceLinkByIdQuery = `
  SELECT *
  FROM source_links
  WHERE id = $1;
`;

export const updateSourceLinkQuery = `
  UPDATE source_links
  SET
    source_id = COALESCE($1, source_id),
    relationship = COALESCE($2, relationship),
    display_order = COALESCE($3, display_order),
    section_id = CASE WHEN $4 THEN $5 ELSE section_id END,
    event_id = CASE WHEN $4 THEN $6 ELSE event_id END,
    person_id = CASE WHEN $4 THEN $7 ELSE person_id END,
    artifact_id = CASE WHEN $4 THEN $8 ELSE artifact_id END,
    story_id = CASE WHEN $4 THEN $9 ELSE story_id END,
    place_id = CASE WHEN $4 THEN $10 ELSE place_id END
  WHERE id = $11
  RETURNING *;
`;

export const deleteSourceLinkQuery = `
  DELETE FROM source_links
  WHERE id = $1
  RETURNING id;
`;
