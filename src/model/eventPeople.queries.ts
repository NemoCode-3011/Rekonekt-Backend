import { publicChild, publicStandalone } from "./visibility";
export const addEventPersonQuery = `
  INSERT INTO event_people (
    event_id,
    person_id
  )
  VALUES ($1, $2)
  RETURNING *;
`;


export const getPeopleByEventQuery = `
  SELECT p.*
  FROM people p
  INNER JOIN event_people ep ON ep.person_id = p.id
  INNER JOIN events e ON e.id = ep.event_id
  WHERE ep.event_id = $1
    AND ${publicStandalone("p")}
    AND ${publicChild("e")}
  ORDER BY p.name ASC;
`;

export const removeEventPersonQuery = `
  DELETE FROM event_people
  WHERE event_id = $1
    AND person_id = $2
  RETURNING *;
`;
