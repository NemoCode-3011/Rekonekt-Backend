import { publicChild } from "./visibility";
import { bundleQuery } from "./bundleShape";

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
  SELECT e.*
  FROM events e
  WHERE e.section_id = $1
    AND ${publicChild("e")}
  ORDER BY e.event_date ASC NULLS LAST;
`;

export const getEventByIdQuery = `
  SELECT e.*
  FROM events e
  WHERE e.id = $1
    AND ${publicChild("e")};
`;

// $8 is the list of fields the request sent. Only those can be cleared.
export const updateEventQuery = `
  UPDATE events
  SET
    section_id = CASE WHEN 'sectionId' = ANY($8::text[]) THEN $1 ELSE section_id END,
    title = COALESCE($2, title),
    slug = COALESCE($3, slug),
    description = CASE WHEN 'description' = ANY($8::text[]) THEN $4 ELSE description END,
    event_date = CASE WHEN 'eventDate' = ANY($8::text[]) THEN $5 ELSE event_date END,
    date_display = CASE WHEN 'dateDisplay' = ANY($8::text[]) THEN $6 ELSE date_display END,
    image_url = CASE WHEN 'imageUrl' = ANY($8::text[]) THEN $7 ELSE image_url END,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $9
  RETURNING *;
`;
export const deleteEventQuery = `
  DELETE FROM events
  WHERE id = $1
  RETURNING id, title, slug;
`;
export const getPublishedEventsQuery = `
  SELECT e.*
  FROM events e
  WHERE ${publicChild("e")}
  ORDER BY e.event_date ASC NULLS LAST;
`;

// Events belong directly to one chapter (events.section_id).
export const getEventBundlesQuery = bundleQuery(`
  SELECT
    s.exhibition_id,
    ev.id,
    ev.slug,
    ev.title,
    ev.image_url,
    s.section_order,
    COALESCE(EXTRACT(EPOCH FROM ev.event_date), 1e15) AS item_order
  FROM events ev
  JOIN sections s ON s.id = ev.section_id
  WHERE ${publicChild("ev")}
`);
