export const addEventPlaceQuery = `
  INSERT INTO event_places (
    event_id,
    place_id
  )
  VALUES ($1, $2)
  RETURNING *;
`;

export const getPlacesByEventQuery = `
  SELECT p.*
  FROM places p
  INNER JOIN event_places ep
    ON p.id = ep.place_id
   WHERE ep.event_id = $1
    AND p.status = 'published'
  ORDER BY p.name ASC;
`;

export const removeEventPlaceQuery = `
  DELETE FROM event_places
  WHERE event_id = $1
    AND place_id = $2
  RETURNING *;
`;
