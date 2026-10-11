export const createProgressQuery = `
  INSERT INTO progress (user_id, exhibition_id, section_id, completed)
  SELECT $1::int, e.id, $3::int, $4::boolean
  FROM exhibitions e
  WHERE e.id = $2
    AND e.status = 'published'
  RETURNING *;
`;
export const getProgressByUserQuery = `
  SELECT
    p.*,
    e.title AS exhibition_title,
    e.slug AS exhibition_slug,
    s.title AS section_title,
    s.slug AS section_slug
  FROM progress p
  INNER JOIN exhibitions e
  ON p.exhibition_id = e.id
 AND e.status = 'published'
  LEFT JOIN sections s
    ON p.section_id = s.id
  WHERE p.user_id = $1
  ORDER BY p.last_viewed_at DESC;
`;

export const getProgressByExhibitionQuery = `
  SELECT
    p.*,
    e.title AS exhibition_title,
    e.slug AS exhibition_slug,
    s.title AS section_title,
    s.slug AS section_slug
  FROM progress p
 INNER JOIN exhibitions e
  ON p.exhibition_id = e.id
 AND e.status = 'published'
  LEFT JOIN sections s
    ON p.section_id = s.id
  WHERE p.user_id = $1
    AND p.exhibition_id = $2;
`;

export const updateProgressQuery = `
  UPDATE progress
  SET
    section_id = COALESCE($1, section_id),
    completed = COALESCE($2, completed),
    last_viewed_at = CURRENT_TIMESTAMP
  WHERE user_id = $3
    AND exhibition_id = $4
  RETURNING *;
`;

export const deleteProgressQuery = `
  DELETE FROM progress
  WHERE user_id = $1
    AND exhibition_id = $2
  RETURNING id;
`;
