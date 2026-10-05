
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
    AND status = 'published'
  ORDER BY event_date ASC NULLS LAST;
`;

export const getEventByIdQuery = `
  SELECT *
  FROM events
  WHERE id = $1
    AND status = 'published';
`;

export const updateEventQuery = `
  UPDATE events
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    description = COALESCE($3, description),
    event_date = COALESCE($4, event_date),
    date_display = COALESCE($5, date_display),
    image_url = COALESCE($6, image_url),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $7
  RETURNING *;
`;

export const deleteEventQuery = `
  DELETE FROM events
  WHERE id = $1
  RETURNING id, title, slug;
`;
export const getPublishedEventsQuery = `
  SELECT *
  FROM events
  WHERE status = 'published'
  ORDER BY event_date ASC NULLS LAST;
`;