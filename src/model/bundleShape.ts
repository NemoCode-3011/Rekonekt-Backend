// The one response shape every /bundles endpoint returns. Each entity passes
// in a query that says which items sit in which exhibition.
// Required columns: exhibition_id, id, slug, title, image_url,
// section_order, item_order.
export const bundleQuery = (members: string) => `
  SELECT
    e.id,
    e.title,
    e.slug,
    e.subtitle,
    e.cover_image_url,
    COUNT(*)::int AS item_count,
    json_agg(
      json_build_object(
        'id', m.id,
        'slug', m.slug,
        'title', m.title,
        'image_url', m.image_url
      )
      ORDER BY m.section_order ASC, m.item_order ASC, m.title ASC
    ) AS items
  FROM exhibitions e
  JOIN (${members}) m ON m.exhibition_id = e.id
  WHERE e.status = 'published'
  GROUP BY e.id
  ORDER BY e.published_at DESC NULLS LAST, e.id DESC;
`;

// The first image attached to a person or artifact in the media library.
export const firstImage = (
  column: "person_id" | "artifact_id",
  alias: string,
) => `
  (SELECT m.file_url
   FROM media_attachments ma
   JOIN media m ON m.id = ma.media_id
   WHERE ma.${column} = ${alias}.id AND m.media_type = 'image'
   ORDER BY ma.display_order ASC, ma.id ASC
   LIMIT 1)`;