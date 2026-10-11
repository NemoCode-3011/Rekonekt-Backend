import { publicChild, publicStandalone } from "./visibility";
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
  INNER JOIN event_places ep ON ep.place_id = p.id
  INNER JOIN events e ON e.id = ep.event_id
  WHERE ep.event_id = $1
    AND ${publicStandalone("p")}
    AND ${publicChild("e")}
  ORDER BY p.name ASC;
`;

export const removeEventPlaceQuery = `
  DELETE FROM event_places
  WHERE event_id = $1
    AND place_id = $2
  RETURNING *;
`;
