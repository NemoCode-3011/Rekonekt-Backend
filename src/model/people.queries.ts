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
    name = $1,
    slug = $2,
    description = $3,
    birth_date = $4,
    death_date = $5,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *;
`;

export const deletePersonQuery = `
  DELETE FROM people
  WHERE id = $1
  RETURNING id, name, slug;
`;
