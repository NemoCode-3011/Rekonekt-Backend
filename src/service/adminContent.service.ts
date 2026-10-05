import { pool } from "src/database/db";

// Tables with a draft/published status that are managed here.
// Table names can't be query parameters, so this list is fixed on purpose.
export type ContentTable = "events" | "artifacts" | "people" | "places" | "stories";

const orderBy: Record<ContentTable, string> = {
  events: "event_date ASC NULLS LAST, id ASC",
  artifacts: "title ASC",
  people: "name ASC",
  places: "name ASC",
  stories: "created_at ASC",
};

const hasSection: ContentTable[] = ["events", "artifacts", "stories"];

export const listAllService = async (table: ContentTable, sectionId?: number) => {
  const filtered = sectionId !== undefined && hasSection.includes(table);

  const result = await pool.query(
    `SELECT * FROM ${table} ${filtered ? "WHERE section_id = $1" : ""} ORDER BY ${orderBy[table]};`,
    filtered ? [sectionId] : [],
  );

  return result.rows;
};

export const getAnyByIdService = async (table: ContentTable, id: number) => {
  const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1;`, [id]);

  if (result.rows.length === 0) {
    throw new Error("Not found");
  }

  return result.rows[0];
};

export const publishService = async (table: ContentTable, id: number) => {
  const result = await pool.query(
    `UPDATE ${table}
     SET status = 'published',
         published_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *;`,
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("Not found");
  }

  return result.rows[0];
};

export const unpublishService = async (table: ContentTable, id: number) => {
  const result = await pool.query(
    `UPDATE ${table}
     SET status = 'draft',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *;`,
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("Not found");
  }

  return result.rows[0];
};