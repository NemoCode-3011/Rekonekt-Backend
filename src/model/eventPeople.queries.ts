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
  INNER JOIN event_people ep
    ON p.id = ep.person_id
    WHERE ep.event_id = $1
    AND p.status = 'published'
  ORDER BY p.name ASC;
`;

export const removeEventPersonQuery = `
  DELETE FROM event_people
  WHERE event_id = $1
    AND person_id = $2
  RETURNING *;
`;
