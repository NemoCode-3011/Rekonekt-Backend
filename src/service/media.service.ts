import { pool } from "../database/db";
import {
  createMediaQuery,
  getMediaQuery,
  getMediaByIdQuery,
  updateMediaQuery,
  deleteMediaQuery,
} from "src/model/media.queries";

export const createMedia = async (
  title: string,
  mediaType: string,
  fileUrl: string,
  caption: string | null,
  description: string | null,
  sourceCredit: string | null,
  license: string | null,
) => {
  const result = await pool.query(createMediaQuery, [
    title,
    mediaType,
    fileUrl,
    caption,
    description,
    sourceCredit,
    license,
  ]);

  return result.rows[0];
};

export const getMedia = async () => {
  const result = await pool.query(getMediaQuery);

  return result.rows;
};

export const getMediaById = async (id: number) => {
  const result = await pool.query(getMediaByIdQuery, [id]);

  return result.rows[0];
};

export const updateMedia = async (
  id: number,
  title: string,
  mediaType: string,
  fileUrl: string,
  caption: string | null,
  description: string | null,
  sourceCredit: string | null,
  license: string | null,
) => {
  const result = await pool.query(updateMediaQuery, [
    title,
    mediaType,
    fileUrl,
    caption,
    description,
    sourceCredit,
    license,
    id,
  ]);

  return result.rows[0];
};

export const deleteMedia = async (id: number) => {
  const result = await pool.query(deleteMediaQuery, [id]);

  return result.rows[0];
};
