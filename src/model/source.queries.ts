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
    title = COALESCE($1, title),
    author = COALESCE($2, author),
    publication = COALESCE($3, publication),
    source_type = COALESCE($4, source_type),
    publication_date = COALESCE($5, publication_date),
    url = COALESCE($6, url),
    citation = COALESCE($7, citation),
    rights_statement = COALESCE($8, rights_statement),
    perspective_note = COALESCE($9, perspective_note),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $10
  RETURNING *;
`;
export const deleteSourceQuery = `
  DELETE FROM sources
  WHERE id = $1
  RETURNING id, title;
`;
