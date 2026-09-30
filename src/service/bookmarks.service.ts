import { pool } from "../database/db";
import {
  createBookmarkQuery,
  getBookmarksByUserQuery,
  getBookmarkByIdQuery,
  deleteBookmarkQuery,
} from "../model/bookmarks.queries";

export const createBookmark = async (userId: number, artifactId: number) => {
  const result = await pool.query(createBookmarkQuery, [userId, artifactId]);

  return result.rows[0];
};

export const getBookmarksByUser = async (userId: number) => {
  const result = await pool.query(getBookmarksByUserQuery, [userId]);

  return result.rows;
};

export const getBookmarkById = async (id: number, userId: number) => {
  const result = await pool.query(getBookmarkByIdQuery, [id, userId]);

  return result.rows[0];
};

export const deleteBookmark = async (id: number, userId: number) => {
  const result = await pool.query(deleteBookmarkQuery, [id, userId]);

  return result.rows[0];
};
