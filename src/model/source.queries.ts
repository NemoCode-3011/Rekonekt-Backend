export const createSourceQuery = `
  INSERT INTO sources (
    title,
    author,
    publication,
    source_type,
    publication_date,
    url,
    citation,
    rights_statement,
    perspective_note
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  RETURNING *;
`;

export const getSourcesQuery = `
  SELECT *
  FROM sources
  ORDER BY created_at DESC;
`;

export const getSourceByIdQuery = `
  SELECT *
  FROM sources
  WHERE id = $1;
`;

export const updateSourceQuery = `
  UPDATE sources
  SET
    title = $1,
    author = $2,
    publication = $3,
    source_type = $4,
    publication_date = $5,
    url = $6,
    citation = $7,
    rights_statement = $8,
    perspective_note = $9,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $10
  RETURNING *;
`;

export const deleteSourceQuery = `
  DELETE FROM sources
  WHERE id = $1
  RETURNING id, title;
`;
