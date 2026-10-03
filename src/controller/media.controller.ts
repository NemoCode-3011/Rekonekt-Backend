import { Request, Response } from "express";
import {
  createMediaService,
  getMedia,
  getMediaById,
  updateMediaService,
  deleteMedia,
} from "src/service/media.service";
import { sendResponse } from "../utils/response";
import { uploadToR2 } from "src/service/r2.service";
import {
  createMediaSchema,
  updateMediaSchema,
} from "src/validation/media.schema";

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

    const media = await createMediaService({
      title,
      mediaType,
      fileUrl,
      caption: caption || null,
      description: description || null,
      sourceCredit: sourceCredit || null,
      license: license || null,
    });

    return sendResponse(res, 201, "Media uploaded successfully", media);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Media upload failed");
  }
};
