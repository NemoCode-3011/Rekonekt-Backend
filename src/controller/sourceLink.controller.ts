import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createSourceLinkService,
  getSourceLinks,
  getSourceLinkById,
  updateSourceLinkService,
  deleteSourceLink,
} from "src/service/sourceLink.service";
import {
  createSourceLinkSchema,
  updateSourceLinkSchema,
} from "src/validation/source-link.schema";

export const createSourceLinkController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = createSourceLinkSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      sourceId,
      sectionId,
      eventId,
      personId,
      artifactId,
      relationship,
      displayOrder,
    } = validation.data;

    const sourceLink = await createSourceLinkService(
      sourceId,
      sectionId ?? null,
      eventId ?? null,
      personId ?? null,
      artifactId ?? null,
      relationship ?? null,
      displayOrder ?? 0,
    );

    return sendResponse(
      res,
      201,
      "Source link created successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23503") {
      return sendResponse(res, 404, "Referenced resource not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getSourceLinksController = async (req: Request, res: Response) => {
  try {
    const sourceLinks = await getSourceLinks();

    return sendResponse(
      res,
      200,
      "Source links retrieved successfully",
      sourceLinks,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve source links");
  }
};

export const getSourceLinkByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    const sourceLink = await getSourceLinkById(id);

    if (!sourceLink) {
      return sendResponse(res, 404, "Source link not found");
    }

    return sendResponse(
      res,
      200,
      "Source link retrieved successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve source link");
  }
};

export const updateSourceLinkController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = updateSourceLinkSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const sourceLink = await updateSourceLinkService(
      Number(req.params.id),
      validation.data as Parameters<typeof updateSourceLinkService>[1],
    );

    return sendResponse(
      res,
      200,
      "Source link updated successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23503") {
      return sendResponse(res, 404, "Referenced resource not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteSourceLinkController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    const sourceLink = await deleteSourceLink(id);

    if (!sourceLink) {
      return sendResponse(res, 404, "Source link not found");
    }

    return sendResponse(
      res,
      200,
      "Source link deleted successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to delete source link");
  }
};
