import { pool } from "../database/db";
import {
  createMediaQuery,
  getMediaQuery,
  getMediaByIdQuery,
  updateMediaQuery,
  deleteMediaQuery,
} from "src/model/media.queries";

export const createMediaService = async (data: {
  title: string;
  mediaType: string;
  fileUrl: string;
  caption?: string;
  description?: string;
  sourceCredit?: string;
  license?: string;
}) => {
  const result = await pool.query(createMediaQuery, [
    data.title,
    data.mediaType,
    data.fileUrl,
    data.caption,
    data.description,
    data.sourceCredit,
    data.license,
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

export const updateMediaService = async (
  id: number,
  data: {
    title?: string;
    mediaType?: string;
    fileUrl?: string;
    caption?: string;
    description?: string;
    sourceCredit?: string;
    license?: string;
  },
) => {
  const result = await pool.query(updateMediaQuery, [
    data.title,
    data.mediaType,
    data.fileUrl,
    data.caption,
    data.description,
    data.sourceCredit,
    data.license,
    id,
  ]);

  return result.rows[0];
};

export const deleteMedia = async (id: number) => {
  const result = await pool.query(deleteMediaQuery, [id]);

  return result.rows[0];
};
