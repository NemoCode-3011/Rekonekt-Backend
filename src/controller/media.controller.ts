import { Request, Response } from "express";
import {
  createMedia,
  getMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
} from "src/service/media.service";
import { sendResponse } from "../utils/response";
import { uploadToR2 } from "src/service/r2.service";

export const createMediaController = async (req: Request, res: Response) => {
  try {
    const {
      title,
      mediaType,
      fileUrl,
      caption,
      description,
      sourceCredit,
      license,
    } = req.body;

    if (!title || !mediaType || !fileUrl) {
      return sendResponse(
        res,
        400,
        "Title, media type and file URL are required",
      );
    }

    const media = await createMedia(
      title,
      mediaType,
      fileUrl,
      caption || null,
      description || null,
      sourceCredit || null,
      license || null,
    );

    return sendResponse(res, 201, "Media created successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getMediaController = async (req: Request, res: Response) => {
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
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media ID");
    }

    const {
      title,
      mediaType,
      fileUrl,
      caption,
      description,
      sourceCredit,
      license,
    } = req.body;

    if (!title || !mediaType || !fileUrl) {
      return sendResponse(
        res,
        400,
        "Title, media type and file URL are required",
      );
    }

    const media = await updateMedia(
      id,
      title,
      mediaType,
      fileUrl,
      caption || null,
      description || null,
      sourceCredit || null,
      license || null,
    );

    if (!media) {
      return sendResponse(res, 404, "Media not found");
    }

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

    return sendResponse(res, 200, "Media deleted successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const uploadMediaController = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, "File is required");
    }

    const { title, mediaType, caption, description, sourceCredit, license } =
      req.body;

    if (!title || !mediaType) {
      return sendResponse(res, 400, "Title and media type are required");
    }

    const fileUrl = await uploadToR2(req.file);

    const media = await createMedia(
      title,
      mediaType,
      fileUrl,
      caption || null,
      description || null,
      sourceCredit || null,
      license || null,
    );

    return sendResponse(res, 201, "Media uploaded successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Media upload failed");
  }
};
