import { Request, Response } from "express";
import {
  createMediaService,
  getMedia,
  getMediaById,
  updateMediaService,
  deleteMedia,
} from "../service/media.service";
import { sendResponse } from "../utils/response";
import {
  createMediaSchema,
  createYouTubeMediaSchema,
  updateMediaSchema,
  uploadMediaSchema,
} from "../validation/media.schema";
import { parseYouTubeVideoUrl } from "../utils/youtube";
import {
  deleteFromR2,
  keyFromUrl,
  removeFileIfUnused,
  uploadToR2,
} from "../service/r2.service";

export const createMediaController = async (req: Request, res: Response) => {
  try {
    const validation = createMediaSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      title,
      mediaType,
      fileUrl,
      caption,
      description,
      sourceCredit,
      license,
    } = validation.data;

    const media = await createMediaService({
      title,
      mediaType,
      fileUrl,
      caption: caption ?? undefined,
      description: description ?? undefined,
      sourceCredit: sourceCredit ?? undefined,
      license: license ?? undefined,
    });

    return sendResponse(res, 201, "Media created successfully", media);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const createYouTubeMediaController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = createYouTubeMediaSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const source = parseYouTubeVideoUrl(validation.data.youtubeUrl);

    if (!source) {
      return sendResponse(res, 400, "A valid YouTube video URL is required");
    }

    const { title, caption, description, sourceCredit, license } =
      validation.data;

    const media = await createMediaService({
      title,
      mediaType: "video",
      fileUrl: source.canonicalUrl,
      caption,
      description,
      sourceCredit,
      license,
    });

    return sendResponse(res, 201, "YouTube video added successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getMediaController = async (_req: Request, res: Response) => {
  try {
    const media = await getMedia();

    return sendResponse(res, 200, "Media retrieved successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getMediaByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media ID");
    }

    const media = await getMediaById(id);

    if (!media) {
      return sendResponse(res, 404, "Media not found");
    }

    return sendResponse(res, 200, "Media retrieved successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateMediaController = async (req: Request, res: Response) => {
  try {
    const validation = updateMediaSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const media = await updateMediaService(
      Number(req.params.id),
      validation.data as Parameters<typeof updateMediaService>[1],
    );

    return sendResponse(res, 200, "Media updated successfully", media);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteMediaController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media ID");
    }

    const media = await deleteMedia(id);

    if (!media) {
      return sendResponse(res, 404, "Media not found");
    }
    try {
      await removeFileIfUnused(media.file_url);
    } catch (error) {
      console.log("Could not remove the file from storage", error);
    }

    return sendResponse(res, 200, "Media deleted successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const mediaTypeFromMime = (mime: string) => {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/")) return "audio";
  if (mime.startsWith("video/")) return "video";
  return "document";
};

export const uploadMediaController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, "File is required");
    }

    // Check the text fields BEFORE the file goes to R2.
    const validation = uploadMediaSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { title, caption, description, sourceCredit, license } =
      validation.data;

    const fileUrl = await uploadToR2(req.file);

    let media;
    try {
      const media = await createMediaService({
        title,
        mediaType: mediaTypeFromMime(req.file.mimetype),
        fileUrl,
        caption: caption || undefined,
        description: description || undefined,
        sourceCredit: sourceCredit || undefined,
        license: license || undefined,
      });
    } catch (error) {
      // The file is already in storage; don't leave it behind.
      const key = keyFromUrl(fileUrl);
      if (key) {
        await deleteFromR2(key).catch((cleanupError) =>
          console.log("Could not remove the unsaved upload", cleanupError),
        );
      }
      throw error;
    }

    return sendResponse(res, 201, "Media uploaded successfully", media);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Media upload failed");
  }
};
