import { pool } from "../database/db";
import {
  createMediaAttachmentQuery,
  getAdminEventMediaQuery,
  getMediaAttachmentsQuery,
  getMediaAttachmentByIdQuery,
  updateMediaAttachmentQuery,
  deleteMediaAttachmentQuery,
  getAdminPicturesQuery,
  type PictureOwner,
} from "../model/mediaAttachments.queries";
import { deleteMedia, withVideoEmbed } from "./media.service";
import { removeFileIfUnused } from "./r2.service";

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

  return result.rows.filter((media) => media.id !== null).map(withVideoEmbed);
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
  const attachment = result.rows[0];

  if (!attachment) return undefined;

  // If that was the last place the picture was used, remove the picture
  // record too, and its file in storage. A failure here must not undo the
  // removal the admin just did, so it is logged instead.
  try {
    const stillUsed = await pool.query(
      "SELECT 1 FROM media_attachments WHERE media_id = $1 LIMIT 1",
      [attachment.media_id],
    );

    if (stillUsed.rowCount === 0) {
      const media = await deleteMedia(attachment.media_id);
      if (media?.file_url) await removeFileIfUnused(media.file_url);
    }
  } catch (error) {
    console.log("Could not clean up the removed picture's file", error);
  }

  return attachment;
};

export const getAdminPictures = async (owner: PictureOwner, id: number) => {
  const result = await pool.query(getAdminPicturesQuery(owner), [id]);

  return result.rows;
};
