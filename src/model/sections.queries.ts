export const createSectionQuery = `
  INSERT INTO sections (
    exhibition_id,
    title,
    slug,
    introduction,
    section_order,
    hero_image_url
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

export const getSectionsByExhibitionQuery = `
  SELECT *
  FROM sections
  WHERE exhibition_id = $1
  ORDER BY section_order ASC;
`;

export const getSectionByIdQuery = `
  SELECT *
  FROM sections
  WHERE id = $1;
`;

export const updateSectionQuery = `
  UPDATE sections
  SET
    title = $1,
    slug = $2,
    introduction = $3,
    section_order = $4,
    hero_image_url = $5,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *;
`;

export const deleteSectionQuery = `
  DELETE FROM sections
  WHERE id = $1
  RETURNING id, title, slug;
`;