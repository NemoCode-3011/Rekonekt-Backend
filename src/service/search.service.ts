import { pool } from "../database/db";
import { searchPublishedContentQuery } from "../model/search.queries";

export const searchPublishedContentService = async (query: string) => {
  const escaped = query.replace(/[\\%_]/g, "\\$&");
  const result = await pool.query(searchPublishedContentQuery, [`%${escaped}%`]);

  return result.rows;
};
