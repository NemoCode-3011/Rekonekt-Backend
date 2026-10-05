// Who can see a record on the public site.
//
// A record is public when it is published itself and, if it belongs to a
// section, that section's exhibition is published too.
// Sections have no status of their own: they follow their exhibition.

// events, artifacts, stories (they can belong to a section)
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
