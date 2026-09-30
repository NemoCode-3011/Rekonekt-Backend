import { pool } from "src/database/db";
import {
  createSectionQuery,
  getSectionsByExhibitionQuery,
  getSectionByIdQuery,
  updateSectionQuery,
  deleteSectionQuery,
} from "../model/sections.queries";

export const createSectionService = async (data: {
  exhibitionId: number;
  title: string;
  slug: string;
  introduction?: string;
  sectionOrder: number;
  heroImageUrl?: string;
}) => {
  try {
    const result = await pool.query(createSectionQuery, [
      data.exhibitionId,
      data.title,
      data.slug,
      data.introduction ?? null,
      data.sectionOrder,
      data.heroImageUrl ?? null,
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Section slug or order already exists");
    }

    if (error.code === "23503") {
      throw new Error("Exhibition not found");
    }

    throw error;
  }
};

export const getSectionsByExhibitionService = async (
  exhibitionId: number
) => {
  const result = await pool.query(
    getSectionsByExhibitionQuery,
    [exhibitionId]
  );

  return result.rows;
};

export const getSectionByIdService = async (id: number) => {
  const result = await pool.query(getSectionByIdQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Section not found");
  }

  return result.rows[0];
};

export const updateSectionService = async (
  id: number,
  data: {
    title: string;
    slug: string;
    introduction?: string;
    sectionOrder: number;
    heroImageUrl?: string;
  }
) => {
  try {
    const result = await pool.query(updateSectionQuery, [
      data.title,
      data.slug,
      data.introduction ?? null,
      data.sectionOrder,
      data.heroImageUrl ?? null,
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Section not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Section slug or order already exists");
    }

    throw error;
  }
};

export const deleteSectionService = async (id: number) => {
  const result = await pool.query(deleteSectionQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Section not found");
  }

  return result.rows[0];
};