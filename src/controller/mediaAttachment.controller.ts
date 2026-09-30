import { Request, Response } from "express";
import {
  createMediaAttachment,
  getMediaAttachments,
  getMediaAttachmentById,
  updateMediaAttachment,
  deleteMediaAttachment,
} from "../service/mediaAttachment.service";
import { sendResponse } from "../utils/response";

export const createMediaAttachmentController = async (req: Request,res: Response) => {
  try {
    const {
      mediaId,
      exhibitionId,
      sectionId,
      eventId,
      personId,
      placeId,
      artifactId,
      displayOrder,
    } = req.body;

    if (!mediaId) {
      return sendResponse(res, 400, "Media ID is required");
    }

    const attachment = await createMediaAttachment(
      mediaId,
      exhibitionId || null,
      sectionId || null,
      eventId || null,
      personId || null,
      placeId || null,
      artifactId || null,
      displayOrder || 0,
    );

    return sendResponse(
      res,
      201,
      "Media attachment created successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getMediaAttachmentsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const attachments = await getMediaAttachments();

    return sendResponse(
      res,
      200,
      "Media attachments retrieved successfully",
      attachments,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getMediaAttachmentByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media attachment ID");
    }

    const attachment = await getMediaAttachmentById(id);

    if (!attachment) {
      return sendResponse(res, 404, "Media attachment not found");
    }

    return sendResponse(
      res,
      200,
      "Media attachment retrieved successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateMediaAttachmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media attachment ID");
    }

    const {
      mediaId,
      exhibitionId,
      sectionId,
      eventId,
      personId,
      placeId,
      artifactId,
      displayOrder,
    } = req.body;

    if (!mediaId) {
      return sendResponse(res, 400, "Media ID is required");
    }

    const attachment = await updateMediaAttachment(
      id,
      mediaId,
      exhibitionId || null,
      sectionId || null,
      eventId || null,
      personId || null,
      placeId || null,
      artifactId || null,
      displayOrder || 0,
    );

    if (!attachment) {
      return sendResponse(res, 404, "Media attachment not found");
    }

    return sendResponse(
      res,
      200,
      "Media attachment updated successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteMediaAttachmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid media attachment ID");
    }

    const attachment = await deleteMediaAttachment(id);

    if (!attachment) {
      return sendResponse(res, 404, "Media attachment not found");
    }

    return sendResponse(
      res,
      200,
      "Media attachment deleted successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
