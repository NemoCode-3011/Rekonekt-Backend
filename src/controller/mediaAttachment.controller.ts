import { Request, Response } from "express";
import {
  createMediaAttachmentService,
  getMediaAttachments,
  getMediaAttachmentById,
  updateMediaAttachment,
  deleteMediaAttachment,
} from "../service/mediaAttachment.service";
import { sendResponse } from "../utils/response";
import {
  updateMediaAttachmentSchema,
  createMediaAttachmentSchema,
} from "src/validation/media-attachment.schema";

export const createMediaAttachmentController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = createMediaAttachmentSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
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
    } = validation.data;

    const attachment = await createMediaAttachmentService(
      mediaId,
      exhibitionId ?? null,
      sectionId ?? null,
      eventId ?? null,
      personId ?? null,
      placeId ?? null,
      artifactId ?? null,
      displayOrder ?? 0,
    );

    return sendResponse(
      res,
      201,
      "Media attachment created successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23503") {
      return sendResponse(res, 404, "Referenced resource not found");
    }

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
    const validation = updateMediaAttachmentSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const attachment = await updateMediaAttachment(
      Number(req.params.id),
      validation.data as Parameters<typeof updateMediaAttachment>[1],
    );

    return sendResponse(
      res,
      200,
      "Media attachment updated successfully",
      attachment,
    );
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23503") {
      return sendResponse(res, 404, "Referenced resource not found");
    }

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
