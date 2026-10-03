export const createNoteQuery = `
  INSERT INTO notes (
    user_id,
    title,
    content,
    note_date
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const getNotesByUserQuery = `
  SELECT *
  FROM notes
  WHERE user_id = $1
  ORDER BY created_at DESC;
`;

export const getNoteByIdQuery = `
  SELECT *
  FROM notes
  WHERE id = $1
    AND user_id = $2;
`;

export const updateNoteQuery = `
  UPDATE notes
  SET
    title = COALESCE($1, title),
    content = COALESCE($2, content),
    note_date = COALESCE($3, note_date),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $4
    AND user_id = $5
  RETURNING *;
`;

export const deleteNoteQuery = `
  DELETE FROM notes
  WHERE id = $1
    AND user_id = $2
  RETURNING id, title;
`;
