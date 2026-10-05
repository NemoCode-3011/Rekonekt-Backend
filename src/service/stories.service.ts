import { pool } from "src/database/db";
import {
  createStoryQuery,
  getStoriesBySectionQuery,
  getStoryByIdQuery,
  updateStoryQuery,
  deleteStoryQuery,
  publishStoryQuery,
  getStoryBySlugQuery,
  getDiscoveryStoryQuery,
  getAllStoriesBySectionQuery,
  getPublishedStoriesQuery,
} from "../model/stories.queries";

export const createStoryService = async (data: {
  sectionId: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
}) => {
  try {
    const result = await pool.query(createStoryQuery, [
      data.sectionId,
      data.title,
      data.slug,
      data.excerpt ?? null,
      data.content ?? null,
      data.coverImageUrl ?? null,
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Story slug already exists");
    }

    if (error.code === "23503") {
      throw new Error("Section not found");
    }

    throw error;
  }
};

export const getStoriesBySectionService = async (sectionId: number) => {
  const result = await pool.query(getStoriesBySectionQuery, [sectionId]);

  return result.rows;
};

export const getStoryByIdService = async (id: number) => {
  const result = await pool.query(getStoryByIdQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Story not found");
  }

  return result.rows[0];
};
export const getAllStoriesBySectionService = async (sectionId: number) => {
  const result = await pool.query(getAllStoriesBySectionQuery, [sectionId]);

  return result.rows;
};

export const updateStoryService = async (
  id: number,
  data: {
    sectionId?: number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string;
    isDiscovery?: boolean;
  },
) => {
  try {
    const result = await pool.query(updateStoryQuery, [
      data.title,
      data.slug,
      data.excerpt ?? null,
      data.content ?? null,
      data.coverImageUrl ?? null,
      data.isDiscovery ?? null,
      id,
    ]);
    if (result.rows.length === 0) {
      throw new Error("Story not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Story slug already exists");
    }

    if (error.code === "23503") {
      throw new Error("Section not found");
    }

    throw error;
  }
};

export const deleteStoryService = async (id: number) => {
  const result = await pool.query(deleteStoryQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Story not found");
  }

  return result.rows[0];
};

export const getDiscoveryStoryService = async () => {
  const result = await pool.query(getDiscoveryStoryQuery);

  if (result.rows.length === 0) {
    throw new Error("Discovery story not found");
  }

  return result.rows[0];
};

export const getStoryBySlugService = async (slug: string) => {
  const result = await pool.query(getStoryBySlugQuery, [slug]);

  if (result.rows.length === 0) {
    throw new Error("Story not found");
  }

  return result.rows[0];
};

export const publishStoryService = async (id: number) => {
  const result = await pool.query(publishStoryQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Story not found");
  }

  return result.rows[0];
};

export const getPublishedStoriesService = async () => {
  const result = await pool.query(getPublishedStoriesQuery);

  return result.rows;
};
