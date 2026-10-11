import { publicChild, publicStandalone } from "./visibility";

export const searchPublishedContentQuery = `
  (SELECT 'exhibition' AS type, id, title, slug, subtitle::text AS summary
   FROM exhibitions
   WHERE status = 'published' AND (title ILIKE $1 OR subtitle ILIKE $1)
   ORDER BY title LIMIT 6)
  UNION ALL
  (SELECT 'person', p.id, p.name, p.slug, p.description::text
   FROM people p
   WHERE ${publicStandalone("p")} AND (p.name ILIKE $1 OR p.description ILIKE $1)
   ORDER BY p.name LIMIT 6)
  UNION ALL
  (SELECT 'event', e.id, e.title, e.slug, e.description::text
   FROM events e
   WHERE ${publicChild("e")} AND (e.title ILIKE $1 OR e.description ILIKE $1)
   ORDER BY e.title LIMIT 6)
  UNION ALL
  (SELECT 'place', pl.id, pl.name, NULL::varchar, pl.description::text
   FROM places pl
   WHERE ${publicStandalone("pl")} AND (pl.name ILIKE $1 OR pl.description ILIKE $1)
   ORDER BY pl.name LIMIT 6)
  UNION ALL
  (SELECT 'artifact', a.id, a.title, a.slug, a.description::text
   FROM artifacts a
   WHERE ${publicChild("a")} AND (a.title ILIKE $1 OR a.description ILIKE $1)
   ORDER BY a.title LIMIT 6)
  UNION ALL
  (SELECT 'story', s.id, s.title, s.slug, s.excerpt::text
   FROM stories s
   WHERE ${publicChild("s")} AND (s.title ILIKE $1 OR s.excerpt ILIKE $1)
   ORDER BY s.title LIMIT 6);
`;