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
  SELECT *
  FROM media_attachments
  ORDER BY display_order ASC, created_at ASC;
`;

export const getMediaAttachmentByIdQuery = `
  SELECT *
  FROM media_attachments
  WHERE id = $1;
`;

export const updateMediaAttachmentQuery = `
  UPDATE media_attachments
  SET
    media_id = $1,
    exhibition_id = $2,
    section_id = $3,
    event_id = $4,
    person_id = $5,
    place_id = $6,
    artifact_id = $7,
    display_order = $8
  WHERE id = $9
  RETURNING *;
`;

export const deleteMediaAttachmentQuery = `
  DELETE FROM media_attachments
  WHERE id = $1
  RETURNING id;
`;
