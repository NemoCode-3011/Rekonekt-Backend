export const createSectionPersonQuery = `
  INSERT INTO section_people (section_id, person_id, display_order)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const getSectionPeopleQuery = `
  SELECT p.*, sp.display_order
  FROM section_people sp
  JOIN sections s ON s.id = sp.section_id
  JOIN exhibitions e ON e.id = s.exhibition_id AND e.status = 'published'
  JOIN people p ON p.id = sp.person_id AND p.status = 'published'
  WHERE sp.section_id = $1
  ORDER BY sp.display_order ASC, p.name ASC;
`;

export const getAdminSectionPeopleQuery = `
  SELECT p.*, sp.display_order
  FROM section_people sp
  JOIN people p ON p.id = sp.person_id
  WHERE sp.section_id = $1
  ORDER BY sp.display_order ASC, p.name ASC;
`;

export const deleteSectionPersonQuery = `
  DELETE FROM section_people
  WHERE section_id = $1 AND person_id = $2
  RETURNING *;
`;

export const createSectionPlaceQuery = `
  INSERT INTO section_places (section_id, place_id, display_order)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

export const getSectionPlacesQuery = `
  SELECT p.*, spl.display_order
  FROM section_places spl
  JOIN sections s ON s.id = spl.section_id
  JOIN exhibitions e ON e.id = s.exhibition_id AND e.status = 'published'
  JOIN places p ON p.id = spl.place_id AND p.status = 'published'
  WHERE spl.section_id = $1
  ORDER BY spl.display_order ASC, p.name ASC;
`;

export const getAdminSectionPlacesQuery = `
  SELECT p.*, spl.display_order
  FROM section_places spl
  JOIN places p ON p.id = spl.place_id
  WHERE spl.section_id = $1
  ORDER BY spl.display_order ASC, p.name ASC;
`;

export const deleteSectionPlaceQuery = `
  DELETE FROM section_places
  WHERE section_id = $1 AND place_id = $2
  RETURNING *;
`;

export const getSourcesForContentQuery = (targetType: SourceTargetType) => {
  const target = sourceTargetQueries[targetType];
  return `
    SELECT s.id, s.title, s.author, s.publication, s.source_type,
           to_char(s.publication_date, 'YYYY-MM-DD') AS publication_date,
           s.url, s.citation, s.rights_statement, s.perspective_note,
           s.created_at, s.updated_at, sl.relationship, sl.display_order
    FROM source_links sl
    JOIN sources s ON s.id = sl.source_id
    JOIN ${target.table} content ON content.id = sl.${target.column}
    WHERE content.id = $1 AND ${target.visibility}
    ORDER BY sl.display_order ASC, s.title ASC;
  `;
};
const sourceTargetQueries = {
  section: {
    column: "section_id",
    table: "sections",
    visibility: `
      EXISTS (
        SELECT 1 FROM exhibitions exh
        WHERE exh.id = content.exhibition_id AND exh.status = 'published'
      )
    `,
  },
  story: {
    column: "story_id",
    table: "stories",
    visibility: `
      content.status = 'published'
      AND (
        content.section_id IS NULL
        OR EXISTS (
          SELECT 1 FROM sections sec
          JOIN exhibitions exh ON exh.id = sec.exhibition_id
          WHERE sec.id = content.section_id AND exh.status = 'published'
        )
      )
    `,
  },
  event: {
    column: "event_id",
    table: "events",
    visibility: `
      content.status = 'published'
      AND (
        content.section_id IS NULL
        OR EXISTS (
          SELECT 1 FROM sections sec
          JOIN exhibitions exh ON exh.id = sec.exhibition_id
          WHERE sec.id = content.section_id AND exh.status = 'published'
        )
      )
    `,
  },
  person: {
    column: "person_id",
    table: "people",
    visibility: "content.status = 'published'",
  },
  place: {
    column: "place_id",
    table: "places",
    visibility: "content.status = 'published'",
  },
  artifact: {
    column: "artifact_id",
    table: "artifacts",
    visibility: `
      content.status = 'published'
      AND (
        content.section_id IS NULL
        OR EXISTS (
          SELECT 1 FROM sections sec
          JOIN exhibitions exh ON exh.id = sec.exhibition_id
          WHERE sec.id = content.section_id AND exh.status = 'published'
        )
      )
    `,
  },
} as const;

export type SourceTargetType = keyof typeof sourceTargetQueries;
