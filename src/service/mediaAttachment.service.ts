import { pool } from "../database/db";
import {
  createMediaAttachmentQuery,
  getAdminEventMediaQuery,
  getMediaAttachmentsQuery,
  getMediaAttachmentByIdQuery,
  updateMediaAttachmentQuery,
  deleteMediaAttachmentQuery,
} from "../model/mediaAttachments.queries";
import { withVideoEmbed } from "./media.service";

export const createMediaAttachmentService = async (
  mediaId: number,
  exhibitionId: number | null,
  sectionId: number | null,
  eventId: number | null,
  personId: number | null,
  placeId: number | null,
  artifactId: number | null,
  displayOrder: number,
) => {
  const result = await pool.query(createMediaAttachmentQuery, [
    mediaId,
    exhibitionId,
    sectionId,
    eventId,
    personId,
    placeId,
    artifactId,
    displayOrder,
  ]);

  return result.rows[0];
};

export const getMediaAttachments = async () => {
  const result = await pool.query(getMediaAttachmentsQuery);

  return result.rows;
};

export const getAdminEventMedia = async (eventId: number) => {
  const result = await pool.query(getAdminEventMediaQuery, [eventId]);

  if (result.rows.length === 0) {
    throw new Error("Event not found");
  }

  return result.rows
    .filter((media) => media.id !== null)
    .map(withVideoEmbed);
};

export const getMediaAttachmentById = async (id: number) => {
  const result = await pool.query(getMediaAttachmentByIdQuery, [id]);

  return result.rows[0];
};

export const updateMediaAttachment = async (
  id: number,
  data: {
    mediaId: number;
    exhibitionId: number | null;
    sectionId: number | null;
    eventId: number | null;
    personId: number | null;
    placeId: number | null;
    artifactId: number | null;
    displayOrder: number;
  },
) => {
  const result = await pool.query(updateMediaAttachmentQuery, [
    data.mediaId,
    data.exhibitionId,
    data.sectionId,
    data.eventId,
    data.personId,
    data.placeId,
    data.artifactId,
    data.displayOrder,
    id,
  ]);

  return result.rows[0];
};

export const deleteMediaAttachment = async (id: number) => {
  const result = await pool.query(deleteMediaAttachmentQuery, [id]);

  return result.rows[0];
};
