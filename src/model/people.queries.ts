export const createPersonQuery = `
  INSERT INTO people (
    name,
    slug,
    description,
    birth_date,
    death_date
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

export const getPeopleQuery = `
  SELECT *
  FROM people
  ORDER BY name ASC;
`;

export const getPersonByIdQuery = `
  SELECT *
  FROM people
  WHERE id = $1;
`;

export const updatePersonQuery = `
  UPDATE people
  SET
    name = COALESCE($1, name),
    slug = COALESCE($2, slug),
    description = COALESCE($3, description),
    birth_date = COALESCE($4, birth_date),
    death_date = COALESCE($5, death_date),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *;
`;

export const deletePersonQuery = `
  DELETE FROM people
  WHERE id = $1
  RETURNING id, name, slug;
`;
