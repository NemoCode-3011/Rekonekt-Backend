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
