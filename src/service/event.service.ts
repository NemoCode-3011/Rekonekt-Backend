import { pool } from "../database/db";

import {
  createEventQuery,
  getEventsBySectionQuery,
  getEventByIdQuery,
  updateEventQuery,
  deleteEventQuery,
  getPublishedEventsQuery,
  getEventBundlesQuery
} from "../model/event.queries";
import { providedKeys } from "../utils/providedKeys";
export const createEventService = async (data: {
  sectionId: number | null;
  title: string;
  slug: string;
  description?: string;
  eventDate?: string;
  dateDisplay?: string;
  imageUrl?: string;
}) => {
  try {
    const result = await pool.query(createEventQuery, [
      data.sectionId,
      data.title,
      data.slug,
      data.description ?? null,
      data.eventDate ?? null,
      data.dateDisplay ?? null,
      data.imageUrl ?? null,
    ]);

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Event slug already exists in this section");
    }

    if (error.code === "23503") {
      throw new Error("Section not found");
    }

    throw error;
  }
};

export const getEventsBySectionService = async (sectionId: number) => {
  const result = await pool.query(getEventsBySectionQuery, [sectionId]);

  return result.rows;
};

export const getEventByIdService = async (id: number) => {
  const result = await pool.query(getEventByIdQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Event not found");
  }

  return result.rows[0];
};

export const updateEventService = async (
  id: number,
  data: {
    sectionId?: number | null;
    title?: string;
    slug?: string;
    description?: string | null;
    eventDate?: string | null;
    dateDisplay?: string | null;
    imageUrl?: string | null;
  },
) => {
  try {
    const result = await pool.query(updateEventQuery, [
      data.sectionId ?? null,
      data.title ?? null,
      data.slug ?? null,
      data.description ?? null,
      data.eventDate ?? null,
      data.dateDisplay ?? null,
      data.imageUrl ?? null,
      providedKeys(data),
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Event not found");
    }

    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      throw new Error("Event slug already exists in this section");
    }

    if (error.code === "23503") {
      throw new Error("Section not found");
    }

    throw error;
  }
};

export const deleteEventService = async (id: number) => {
  const result = await pool.query(deleteEventQuery, [id]);

  if (result.rows.length === 0) {
    throw new Error("Event not found");
  }

  return result.rows[0];
};
export const getPublishedEventsService = async () => {
  const result = await pool.query(getPublishedEventsQuery);

  return result.rows;
};

export const getEventBundlesService = async () => {
  const result = await pool.query(getEventBundlesQuery);

  return result.rows;
};