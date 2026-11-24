import { pool } from "../database/db";
import { getCulturalGroupsQuery } from "../model/culturalGroups.queries";

export const getCulturalGroupsService = async () => {
  const result = await pool.query(getCulturalGroupsQuery);
  return result.rows;
};