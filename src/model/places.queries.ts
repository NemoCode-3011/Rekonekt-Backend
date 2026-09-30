export const createPlaceQuery = `
  INSERT INTO places (
    name,
    description,
    latitude,
    longitude
  )
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const getPlacesQuery = `
  SELECT *
  FROM places
  ORDER BY name ASC;
`;

export const getPlaceByIdQuery = `
  SELECT *
  FROM places
  WHERE id = $1;
`;

export const updatePlaceQuery = `
  UPDATE places
  SET
    name = $1,
    description = $2,
    latitude = $3,
    longitude = $4,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $5
  RETURNING *;
`;

export const deletePlaceQuery = `
  DELETE FROM places
  WHERE id = $1
  RETURNING id, name;
`;