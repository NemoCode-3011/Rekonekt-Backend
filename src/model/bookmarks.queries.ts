export const createBookmarkQuery = `
  INSERT INTO bookmarks (
    user_id,
    artifact_id
  )
  VALUES ($1, $2)
  RETURNING *;
`;

export const getBookmarksByUserQuery = `
  SELECT
    b.id,
    b.user_id,
    b.artifact_id,
    a.title,
    a.slug,
    a.artifact_type,
    a.description,
    a.historical_context,
    a.date_display,
    a.place_id,
    b.created_at
  FROM bookmarks b
  INNER JOIN artifacts a
    ON b.artifact_id = a.id
  WHERE b.user_id = $1
  ORDER BY b.created_at DESC;
`;

export const getBookmarkByIdQuery = `
  SELECT *
  FROM bookmarks
  WHERE id = $1
    AND user_id = $2;
`;

export const deleteBookmarkQuery = `
  DELETE FROM bookmarks
  WHERE id = $1
    AND user_id = $2
  RETURNING id, artifact_id;
`;
