import { pool } from "src/database/db";
import {
  getPublishedExhibitionsQuery,
  getExhibitionBySlugQuery,
  createExhibitionQuery,
  publishExhibitionQuery,
  deleteExhibitionQuery,
  updateExhibitionQuery,
} from "src/model/exhibition.queries";

export const getPublishedExhibitionsService = async () => {
  const result = await pool.query(getPublishedExhibitionsQuery);

  return result.rows;
};

export const getExhibitionBySlugService = async (slug: string) => {
  const result = await pool.query(getExhibitionBySlugQuery, [slug]);

  if (result.rows.length === 0) {
    throw new Error("Exhibition not found");
  }

  return result.rows[0];
};

export const createExhibitionService = async (data: {
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImageUrl?: string;
}) => {
  try {
    const result = await pool.query(createExhibitionQuery, [
      data.title,
      data.slug,
      data.subtitle ?? null,
      data.description ?? null,
      data.startDate ?? null,
      data.endDate ?? null,
      data.coverImageUrl ?? null,
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Exhibition slug already exists");
    }

    throw error;
  }
};

export const publishExhibitionService = async (id: number) => {
  const result = await pool.query(publishExhibitionQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Exhibition not found");
  }

  return result.rows[0];
};

export const deleteExhibitionService = async (id: number) => {
  const result = await pool.query(deleteExhibitionQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Exhibition not found");
  }

  return result.rows[0];
};

export const updateExhibitionService = async (id: number,
  data: {
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    coverImageUrl?: string;
  },
) => {
  try {
    const result = await pool.query(updateExhibitionQuery, [
      data.title,
      data.slug,
      data.subtitle ?? null,
      data.description ?? null,
      data.startDate ?? null,
      data.endDate ?? null,
      data.coverImageUrl ?? null,
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Exhibition not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Exhibition slug already exists");
    }
    throw error;
  }
};
