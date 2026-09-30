import { pool } from "../database/db";
import {
  createNoteQuery,
  getNotesByUserQuery,
  getNoteByIdQuery,
  updateNoteQuery,
  deleteNoteQuery,
} from "src/model/note.queries";

export const createNote = async (
  userId: number,
  title: string | null,
  content: string,
  noteDate: string | null,
) => {
  const result = await pool.query(createNoteQuery, [
    userId,
    title,
    content,
    noteDate,
  ]);

  return result.rows[0];
};

export const getNotesByUser = async (userId: number) => {
  const result = await pool.query(getNotesByUserQuery, [userId]);

  return result.rows;
};

export const getNoteById = async (id: number, userId: number) => {
  const result = await pool.query(getNoteByIdQuery, [id, userId]);

  return result.rows[0];
};

export const updateNote = async (
  id: number,
  userId: number,
  title: string | null,
  content: string,
  noteDate: string | null,
) => {
  const result = await pool.query(updateNoteQuery, [
    title,
    content,
    noteDate,
    id,
    userId,
  ]);

  return result.rows[0];
};

export const deleteNote = async (id: number, userId: number) => {
  const result = await pool.query(deleteNoteQuery, [id, userId]);

  return result.rows[0];
};
