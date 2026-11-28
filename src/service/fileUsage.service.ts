import { pool } from "../database/db";

let columns:
  | Promise<{ table_name: string; column_name: string }[]>
  | undefined;

// Every text column in the database, so new tables and columns are covered
// without editing this file.
const textColumns = () => {
  columns ??= pool
    .query(
      `SELECT table_name, column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND data_type IN ('character varying', 'text', 'json', 'jsonb')`,
    )
    .then((result) => result.rows)
    .catch((error) => {
      columns = undefined;
      throw error;
    });

  return columns;
};

const quote = (name: string) => `"${name.replace(/"/g, '""')}"`;

// True if the file is used anywhere: a column holding its URL, or a picture
// inside rich text. Keys are random UUIDs, so a match is never a coincidence.
export const isFileReferenced = async (key: string) => {
  const pattern = `%${key}%`;

  for (const { table_name, column_name } of await textColumns()) {
    // A picture record with no attachments is only a leftover, not a use.
    const leftoverGuard =
      table_name === "media" && column_name === "file_url"
        ? " AND EXISTS (SELECT 1 FROM media_attachments ma WHERE ma.media_id = media.id)"
        : "";

    const found = await pool.query(
      `SELECT 1 FROM ${quote(table_name)}
       WHERE ${quote(column_name)}::text LIKE $1${leftoverGuard}
       LIMIT 1`,
      [pattern],
    );

    if (found.rowCount) return true;
  }

  return false;
};