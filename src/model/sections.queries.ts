import { publicSection } from "./visibility";

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

export const getAllSectionsByExhibitionQuery = `
  SELECT *
  FROM sections
  WHERE exhibition_id = $1
  ORDER BY section_order ASC;
`;

export const updateSectionQuery = `
  UPDATE sections
  SET
    title = COALESCE($1, title),
    slug = COALESCE($2, slug),
    introduction = COALESCE($3, introduction),
    section_order = COALESCE($4, section_order),
    hero_image_url = COALESCE($5, hero_image_url),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *;
`;

export const deleteSectionQuery = `
  DELETE FROM sections
  WHERE id = $1
  RETURNING id, title, slug;
`;
