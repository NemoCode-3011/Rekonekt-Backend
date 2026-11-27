import { publicAttachment } from "./visibility";

export const createMediaAttachmentQuery = `
  INSERT INTO media_attachments (
    media_id,
    exhibition_id,
    section_id,
    event_id,
    person_id,
    place_id,
    artifact_id,
    display_order
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  RETURNING *;
`;

export const getMediaAttachmentsQuery = `
  SELECT ma.*
  FROM media_attachments ma
  WHERE ${publicAttachment("ma")}
  ORDER BY ma.display_order ASC, ma.created_at ASC;
`;

export const getAdminEventMediaQuery = `
  SELECT m.*, ma.id AS attachment_id, ma.display_order
  FROM events e
  LEFT JOIN media_attachments ma ON ma.event_id = e.id
  LEFT JOIN media m ON m.id = ma.media_id
  WHERE e.id = $1
  ORDER BY ma.display_order ASC NULLS LAST, ma.created_at ASC NULLS LAST;
`;

export const getMediaAttachmentByIdQuery = `
  SELECT ma.*
  FROM media_attachments ma
  WHERE ma.id = $1
    AND ${publicAttachment("ma")};
`;

export const updateMediaAttachmentQuery = `
  UPDATE media_attachments
  SET
    media_id = COALESCE($1, media_id),
    exhibition_id = COALESCE($2, exhibition_id),
    section_id = COALESCE($3, section_id),
    event_id = COALESCE($4, event_id),
    person_id = COALESCE($5, person_id),
    place_id = COALESCE($6, place_id),
    artifact_id = COALESCE($7, artifact_id),
    display_order = COALESCE($8, display_order)
  WHERE id = $9
  RETURNING *;
`;

export const deleteMediaAttachmentQuery = `
  DELETE FROM media_attachments
  WHERE id = $1
  RETURNING id;
`;
const pictureOwnerColumns = {
  people: "person_id",
  places: "place_id",
  artifacts: "artifact_id",
} as const;

export type PictureOwner = keyof typeof pictureOwnerColumns;

export const isPictureOwner = (value: string): value is PictureOwner =>
  value in pictureOwnerColumns;

// Admins see pictures on drafts too, so this does not use publicAttachment.
export const getAdminPicturesQuery = (owner: PictureOwner) => `
  SELECT m.*, ma.id AS attachment_id, ma.display_order
  FROM media_attachments ma
  JOIN media m ON m.id = ma.media_id
  WHERE ma.${pictureOwnerColumns[owner]} = $1
    AND m.media_type = 'image'
  ORDER BY ma.display_order ASC, ma.created_at ASC;
`;