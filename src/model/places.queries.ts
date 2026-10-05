import { publicStandalone } from "./visibility";

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
  SELECT pl.*
  FROM places pl
  WHERE ${publicStandalone("pl")}
  ORDER BY pl.name ASC;
`;

export const getPlaceByIdQuery = `
  SELECT pl.*
  FROM places pl
  WHERE pl.id = $1
    AND ${publicStandalone("pl")};
`;

export const updatePlaceQuery = `
  UPDATE places
  SET
    name = COALESCE($1, name),
    description = COALESCE($2, description),
    latitude = COALESCE($3, latitude),
    longitude = COALESCE($4, longitude),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $5
  RETURNING *;
`;
export const deletePlaceQuery = `
  DELETE FROM places
  WHERE id = $1
  RETURNING id, name;
`;
