// Who can see a record on the public site.
export const publicChild = (alias: string) => `
  ${alias}.status = 'published'
  AND (
    ${alias}.section_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM sections sec
      JOIN exhibitions exh ON exh.id = sec.exhibition_id
      WHERE sec.id = ${alias}.section_id
        AND exh.status = 'published'
    )
  )
`;

// people, places
export const publicStandalone = (alias: string) =>
  `${alias}.status = 'published'`;

// sections
export const publicSection = (alias: string) => `
  EXISTS (
    SELECT 1
    FROM exhibitions exh
    WHERE exh.id = ${alias}.exhibition_id
      AND exh.status = 'published'
  )
`;

// media_attachments rows: public when the thing they are attached to is public
export const publicAttachment = (alias: string) => `(
  EXISTS (
    SELECT 1 FROM exhibitions ex
    WHERE ex.id = ${alias}.exhibition_id AND ex.status = 'published'
  )
  OR EXISTS (
    SELECT 1 FROM sections s
    WHERE s.id = ${alias}.section_id AND ${publicSection("s")}
  )
  OR EXISTS (
    SELECT 1 FROM events ev
    WHERE ev.id = ${alias}.event_id AND ${publicChild("ev")}
  )
  OR EXISTS (
    SELECT 1 FROM people pe
    WHERE pe.id = ${alias}.person_id AND ${publicStandalone("pe")}
  )
  OR EXISTS (
    SELECT 1 FROM places pl
    WHERE pl.id = ${alias}.place_id AND ${publicStandalone("pl")}
  )
  OR EXISTS (
    SELECT 1 FROM artifacts ar
    WHERE ar.id = ${alias}.artifact_id AND ${publicChild("ar")}
  )
)`;

// media is public when at least one of its
// attachments is public. Unattached uploads stay hidden.
export const publicMedia = (alias: string) => `
  EXISTS (
    SELECT 1
    FROM media_attachments ma
    WHERE ma.media_id = ${alias}.id
      AND ${publicAttachment("ma")}
  )
`;