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
    source_id = $1,
    section_id = $2,
    event_id = $3,
    person_id = $4,
    artifact_id = $5,
    relationship = $6,
    display_order = $7
  WHERE id = $8
  RETURNING *;
`;

export const deleteSourceLinkQuery = `
  DELETE FROM source_links
  WHERE id = $1
  RETURNING id;
`;
