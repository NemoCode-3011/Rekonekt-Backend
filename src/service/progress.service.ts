import { pool } from "../database/db";
import {
  createProgressQuery,
  getProgressByUserQuery,
  getProgressByExhibitionQuery,
  updateProgressQuery,
  deleteProgressQuery,
} from "src/model/progress.queries";

export const createProgressService = async (
  userId: number,
  exhibitionId: number,
  sectionId: number | null,
  completed: boolean,
) => {
  const result = await pool.query(createProgressQuery, [
    userId,
    exhibitionId,
    sectionId,
    completed,
  ]);

  return result.rows[0];
};

export const getProgressByUserService = async (userId: number) => {
  const result = await pool.query(getProgressByUserQuery, [userId]);

  return result.rows;
};

export const getProgressByExhibitionService = async (
  userId: number,
  exhibitionId: number,
) => {
  const result = await pool.query(getProgressByExhibitionQuery, [
    userId,
    exhibitionId,
  ]);

  return result.rows[0];
};

export const updateProgressService = async (
  userId: number,
  exhibitionId: number,
  sectionId: number | null,
  completed: boolean,
) => {
  const result = await pool.query(updateProgressQuery, [
    sectionId,
    completed,
    userId,
    exhibitionId,
  ]);

  return result.rows[0];
};

export const deleteProgressService = async (userId: number, exhibitionId: number) => {
  const result = await pool.query(deleteProgressQuery, [userId, exhibitionId]);

  return result.rows[0];
};
