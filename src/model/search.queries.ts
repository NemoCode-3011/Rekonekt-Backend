import { foldSql } from "./searchFold";
import { publicChild, publicStandalone } from "./visibility";

// $1 is already folded by the service, so only the column is folded here.
const like = (column: string) => `${foldSql(column)} LIKE $1`;

export const searchPublishedContentQuery = `
  (SELECT 'exhibition' AS type, id, title, slug, subtitle::text AS summary
   FROM exhibitions
   WHERE status = 'published' AND (${like("title")} OR ${like("subtitle")})
   ORDER BY title LIMIT 6)
  UNION ALL
  (SELECT 'person', p.id, p.name, p.slug, p.description::text
   FROM people p
   WHERE ${publicStandalone("p")} AND (${like("p.name")} OR ${like("p.description")})
   ORDER BY p.name LIMIT 6)
  UNION ALL
  (SELECT 'event', e.id, e.title, e.slug, e.description::text
   FROM events e
   WHERE ${publicChild("e")} AND (${like("e.title")} OR ${like("e.description")})
   ORDER BY e.title LIMIT 6)
  UNION ALL
  (SELECT 'place', pl.id, pl.name, pl.slug, COALESCE(pl.summary, pl.description)::text
   FROM places pl
   WHERE ${publicStandalone("pl")}
     AND (${like("pl.name")} OR ${like("pl.summary")} OR ${like("pl.description")} OR ${like("pl.region")})
   ORDER BY pl.name LIMIT 6)
  UNION ALL
  (SELECT 'artifact', a.id, a.title, a.slug, a.description::text
   FROM artifacts a
   WHERE ${publicChild("a")} AND (${like("a.title")} OR ${like("a.description")})
   ORDER BY a.title LIMIT 6)
  UNION ALL
  (SELECT 'wonder', w.id, w.title, w.slug, w.summary::text
   FROM wonders w
   WHERE ${publicStandalone("w")}
     AND (${like("w.title")} OR ${like("w.summary")} OR ${like("w.region")} OR ${like("w.content")})
   ORDER BY w.title LIMIT 6)
  UNION ALL
  (SELECT 'story', s.id, s.title, s.slug, s.excerpt::text
   FROM stories s
   WHERE ${publicChild("s")} AND (${like("s.title")} OR ${like("s.excerpt")})
   ORDER BY s.title LIMIT 6);
`;