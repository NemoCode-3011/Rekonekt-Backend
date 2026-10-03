export const createSourceLinkQuery = `
  INSERT INTO source_links (
    source_id,
    section_id,
    event_id,
    person_id,
    artifact_id,
    relationship,
    display_order
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
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
    section_id = COALESCE($2, section_id),
    event_id = COALESCE($3, event_id),
    person_id = COALESCE($4, person_id),
    artifact_id = COALESCE($5, artifact_id),
    relationship = COALESCE($6, relationship),
    display_order = COALESCE($7, display_order)
  WHERE id = $8
  RETURNING *;
`;

export const deleteSourceLinkQuery = `
  DELETE FROM source_links
  WHERE id = $1
  RETURNING id;
`;
