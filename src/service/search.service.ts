import { pool } from "../database/db";
import { searchPublishedContentQuery } from "../model/search.queries";
import { foldText } from "../utils/searchText";

export const searchPublishedContentService = async (query: string) => {
  const escaped = foldText(query).replace(/[\\%_]/g, "\\$&");
  const result = await pool.query(searchPublishedContentQuery, [`%${escaped}%`]);

  return result.rows;
};