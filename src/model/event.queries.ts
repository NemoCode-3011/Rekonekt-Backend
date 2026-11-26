import { publicChild } from "./visibility";
import { bundleQuery} from "./bundleShape";

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

export const updateEventQuery = `
  UPDATE events
  SET
    section_id = CASE WHEN $2 THEN $1 ELSE section_id END,
    title = COALESCE($3, title),
    slug = COALESCE($4, slug),
    description = COALESCE($5, description),
    event_date = COALESCE($6, event_date),
    date_display = COALESCE($7, date_display),
    image_url = COALESCE($8, image_url),
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