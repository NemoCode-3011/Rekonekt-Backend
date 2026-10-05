import { pool } from "../database/db";
import { searchPublishedContentQuery } from "../model/search.queries";

export const searchPublishedContentService = async (query: string) => {
  const result = await pool.query(searchPublishedContentQuery, [`%${query}%`]);

  return result.rows;
};
