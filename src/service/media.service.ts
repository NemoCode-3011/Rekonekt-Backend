import { pool } from "../database/db";
import {
  createMediaQuery,
  getMediaQuery,
  getMediaByIdQuery,
  updateMediaQuery,
  deleteMediaQuery,
} from "src/model/media.queries";
import { parseYouTubeVideoUrl } from "src/utils/youtube";

type MediaRow = {
  media_type?: string;
  file_url?: string;
  [key: string]: unknown;
};

export const withVideoEmbed = (media: MediaRow) => {
  const youtubeSource =
    media.media_type === "video" && typeof media.file_url === "string"
      ? parseYouTubeVideoUrl(media.file_url)
      : null;

  return {
    ...media,
    video_provider: youtubeSource ? "youtube" : null,
    embed_url: youtubeSource?.embedUrl ?? null,
  };
};

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

  return withVideoEmbed(result.rows[0]);
};

export const getMedia = async () => {
  const result = await pool.query(getMediaQuery);

  return result.rows.map(withVideoEmbed);
};

export const getMediaById = async (id: number) => {
  const result = await pool.query(getMediaByIdQuery, [id]);

  return result.rows[0] ? withVideoEmbed(result.rows[0]) : undefined;
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

  return result.rows[0] ? withVideoEmbed(result.rows[0]) : undefined;
};

export const deleteMedia = async (id: number) => {
  const result = await pool.query(deleteMediaQuery, [id]);

  return result.rows[0];
};
