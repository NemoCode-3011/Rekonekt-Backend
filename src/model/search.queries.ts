export const searchPublishedContentQuery = `
  SELECT 'exhibition' AS type, id, title, slug, subtitle::text AS summary
  FROM exhibitions
  WHERE status = 'published' AND (title ILIKE $1 OR subtitle ILIKE $1)

  UNION ALL
  SELECT 'person', id, name, slug, description::text
  FROM people
  WHERE status = 'published' AND (name ILIKE $1 OR description ILIKE $1)

  UNION ALL
  SELECT 'event', id, title, slug, description::text
  FROM events
  WHERE status = 'published' AND (title ILIKE $1 OR description ILIKE $1)

  UNION ALL
  SELECT 'place', id, name, NULL::varchar, description::text
  FROM places
  WHERE status = 'published' AND (name ILIKE $1 OR description ILIKE $1)

  UNION ALL
  SELECT 'artifact', id, title, slug, description::text
  FROM artifacts
  WHERE status = 'published' AND (title ILIKE $1 OR description ILIKE $1)

  UNION ALL
  SELECT 'story', id, title, slug, excerpt::text
  FROM stories
  WHERE status = 'published' AND (title ILIKE $1 OR excerpt ILIKE $1)

  LIMIT 30;
`;
