export const createEventQuery = `
  INSERT INTO events (
    section_id,
    title,
    slug,
    description,
    event_date,
    date_display,
    image_url
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;
`;

export const getEventsBySectionQuery = `
  SELECT *
  FROM events
  WHERE section_id = $1
  ORDER BY event_date ASC NULLS LAST;
`;

export const getEventByIdQuery = `
  SELECT *
  FROM events
  WHERE id = $1;
`;

export const updateEventQuery = `
  UPDATE events
  SET
    section_id = $1,
    title = $2,
    slug = $3,
    description = $4,
    event_date = $5,
    date_display = $6,
    image_url = $7,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $8
  RETURNING *;
`;

export const deleteEventQuery = `
  DELETE FROM events
  WHERE id = $1
  RETURNING id, title, slug;
`;
