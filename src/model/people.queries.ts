import { bundleQuery, firstImage } from "./bundleShape";
import { publicStandalone } from "./visibility";
export const createPersonQuery = `
  INSERT INTO people (
    name,
    slug,
    description,
    birth_date,
    death_date
  )
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;


export const getPeopleQuery = `
  SELECT p.*
  FROM people p
  WHERE ${publicStandalone("p")}
  ORDER BY p.name ASC;
`;

export const getPersonByIdQuery = `
  SELECT p.*
  FROM people p
  WHERE p.id = $1
    AND ${publicStandalone("p")};
`;

export const getPersonBySlugQuery = `
  SELECT p.*
  FROM people p
  WHERE p.slug = $1
    AND ${publicStandalone("p")};
`;
export const updatePersonQuery = `
  UPDATE people
  SET
    name = COALESCE($1, name),
    slug = COALESCE($2, slug),
    description = COALESCE($3, description),
    birth_date = COALESCE($4, birth_date),
    death_date = COALESCE($5, death_date),
    updated_at = CURRENT_TIMESTAMP
  WHERE id = $6
  RETURNING *;
`;

export const deletePersonQuery = `
  DELETE FROM people
  WHERE id = $1
  RETURNING id, name, slug;
`;

// People reach an exhibition through chapters (section_people). A person used
// in several chapters of one exhibition is listed once.
export const getPeopleBundlesQuery = bundleQuery(`
  SELECT
    s.exhibition_id,
    p.id,
    p.slug,
    p.name AS title,
    ${firstImage("person_id", "p")} AS image_url,
    MIN(s.section_order) AS section_order,
    MIN(sp.display_order) AS item_order
  FROM section_people sp
  JOIN sections s ON s.id = sp.section_id
  JOIN people p ON p.id = sp.person_id
  WHERE ${publicStandalone("p")}
  GROUP BY s.exhibition_id, p.id
`);

