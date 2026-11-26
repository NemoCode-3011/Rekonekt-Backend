import { publicChild, publicStandalone } from "./visibility";

export const createPlaceQuery = `
  INSERT INTO places (
    name, slug, description, summary, region, category,
    latitude, longitude,
    cover_image_url, cover_image_alt, cover_image_credit
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING *;
`;

// Every optional filter can be left out by passing null.
export const getPlacesQuery = `
  SELECT pl.*
  FROM places pl
  WHERE ${publicStandalone("pl")}
    AND ($1::text IS NULL OR pl.region = $1)
    AND ($2::text IS NULL OR pl.category = $2)
    AND (
      $3::text IS NULL
      OR pl.name ILIKE $3
      OR pl.summary ILIKE $3
      OR pl.region ILIKE $3
    )
  ORDER BY pl.name ASC;
`;

// How many published places there are per region and per category, for the browse filters.
export const getPlaceFacetsQuery = `
  SELECT 'region' AS facet, pl.region::text AS value, COUNT(*)::int AS count
  FROM places pl
  WHERE ${publicStandalone("pl")} AND pl.region IS NOT NULL
  GROUP BY pl.region
  UNION ALL
  SELECT 'category', pl.category::text, COUNT(*)::int
  FROM places pl
  WHERE ${publicStandalone("pl")} AND pl.category IS NOT NULL
  GROUP BY pl.category
  UNION ALL
  SELECT 'total', NULL::text, COUNT(*)::int
  FROM places pl
  WHERE ${publicStandalone("pl")}
  UNION ALL
  SELECT 'pinned', NULL::text, COUNT(*)::int
  FROM places pl
  WHERE ${publicStandalone("pl")}
    AND pl.latitude IS NOT NULL AND pl.longitude IS NOT NULL;
`;

// Each published exhibition with the published places inside its chapters, for the
// browse page's exhibition tiles. A place used in several chapters of one exhibition
// is listed once. Places come in chapter order, then in the order set in the chapter.
export const getPlaceBundlesQuery = `
  SELECT
    e.id,
    e.title,
    e.slug,
    e.subtitle,
    e.cover_image_url,
    COUNT(*)::int AS place_count,
    json_agg(
      json_build_object(
        'id', member.id,
        'name', member.name,
        'slug', member.slug,
        'region', member.region,
        'category', member.category,
        'cover_image_url', member.cover_image_url,
        'cover_image_alt', member.cover_image_alt
      )
      ORDER BY member.section_order ASC, member.display_order ASC, member.name ASC
    ) AS places
  FROM exhibitions e
  JOIN (
    SELECT
      s.exhibition_id,
      pl.id,
      pl.name,
      pl.slug,
      pl.region,
      pl.category,
      pl.cover_image_url,
      pl.cover_image_alt,
      MIN(s.section_order) AS section_order,
      MIN(spl.display_order) AS display_order
    FROM section_places spl
    JOIN sections s ON s.id = spl.section_id
    JOIN places pl ON pl.id = spl.place_id
    WHERE ${publicStandalone("pl")}
    GROUP BY s.exhibition_id, pl.id
  ) member ON member.exhibition_id = e.id
  WHERE e.status = 'published'
  GROUP BY e.id
  ORDER BY e.published_at DESC NULLS LAST, e.id DESC;
`;

export const getPlaceByIdQuery = `
  SELECT pl.*
  FROM places pl
  WHERE pl.id = $1
    AND ${publicStandalone("pl")};
`;

export const getPlaceBySlugQuery = `
  SELECT pl.*
  FROM places pl
  WHERE pl.slug = $1
    AND ${publicStandalone("pl")};
`;

// Events that happened here, and artifacts found here: only ones visitors can see.
export const getPlaceEventsQuery = `
  SELECT e.id, e.title, e.slug, e.event_date, e.date_display, e.image_url
  FROM events e
  JOIN event_places ep ON ep.event_id = e.id
  WHERE ep.place_id = $1
    AND ${publicChild("e")}
  ORDER BY e.event_date ASC NULLS LAST, e.title ASC;
`;

export const getPlaceArtifactsQuery = `
  SELECT a.id, a.title, a.slug, a.artifact_type, a.date_display
  FROM artifacts a
  WHERE a.place_id = $1
    AND ${publicChild("a")}
  ORDER BY a.title ASC;
`;

// "Where next?": the closest other places, with the distance in kilometres.
//   $1 this place's id   $2 latitude   $3 longitude
export const getNearbyPlacesQuery = `
  SELECT id, name, slug, region, category, cover_image_url, cover_image_alt, distance_km
  FROM (
    SELECT pl.id, pl.name, pl.slug, pl.region, pl.category,
           pl.cover_image_url, pl.cover_image_alt,
           ROUND((
             6371 * acos(LEAST(1, GREATEST(-1,
               cos(radians($2::float8)) * cos(radians(pl.latitude::float8))
                 * cos(radians(pl.longitude::float8) - radians($3::float8))
               + sin(radians($2::float8)) * sin(radians(pl.latitude::float8))
             )))
           )::numeric, 1) AS distance_km
    FROM places pl
    WHERE ${publicStandalone("pl")}
      AND pl.id <> $1
      AND pl.latitude IS NOT NULL
      AND pl.longitude IS NOT NULL
  ) nearby
  ORDER BY distance_km ASC, name ASC
  LIMIT 4;
`;

export const getPlaceByIdForUpdateQuery = `
  SELECT *
  FROM places
  WHERE id = $1
  FOR UPDATE;
`;

// Every column is written, because the service merges the changes with the saved
// place first. That is what lets a field be cleared with null.
export const updatePlaceQuery = `
  UPDATE places
  SET
    name = $1,
    slug = $2,
    description = $3,
    summary = $4,
    region = $5,
    category = $6,
    latitude = $7,
    longitude = $8,
    cover_image_url = $9,
    cover_image_alt = $10,
    cover_image_credit = $11,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $12
  RETURNING *;
`;

export const deletePlaceQuery = `
  DELETE FROM places
  WHERE id = $1
  RETURNING id, name;
`;