import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createSourceLink,
  getSourceLinks,
  getSourceLinkById,
  updateSourceLink,
  deleteSourceLink,
} from "src/service/sourceLink.service";

export const createSourceLinkController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      sourceId,
      sectionId,
      eventId,
      personId,
      artifactId,
      relationship,
      displayOrder,
    } = req.body;

    if (!sourceId) {
      return sendResponse(res, 400, "Source ID is required");
    }

    if (!sectionId && !eventId && !personId && !artifactId) {
      return sendResponse(res, 400, "At least one content ID is required");
    }

    const sourceLink = await createSourceLink(
      Number(sourceId),
      sectionId ? Number(sectionId) : null,
      eventId ? Number(eventId) : null,
      personId ? Number(personId) : null,
      artifactId ? Number(artifactId) : null,
      relationship || null,
      displayOrder ? Number(displayOrder) : 0,
    );

    return sendResponse(
      res,
      201,
      "Source link created successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to create source link");
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
    const id = Number(req.params.id);

    const {
      sourceId,
      sectionId,
      eventId,
      personId,
      artifactId,
      relationship,
      displayOrder,
    } = req.body;

    if (!sourceId) {
      return sendResponse(res, 400, "Source ID is required");
    }

    const sourceLink = await updateSourceLink(
      id,
      Number(sourceId),
      sectionId ? Number(sectionId) : null,
      eventId ? Number(eventId) : null,
      personId ? Number(personId) : null,
      artifactId ? Number(artifactId) : null,
      relationship || null,
      displayOrder ? Number(displayOrder) : 0,
    );

    if (!sourceLink) {
      return sendResponse(res, 404, "Source link not found");
    }

    return sendResponse(
      res,
      200,
      "Source link updated successfully",
      sourceLink,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to update source link");
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
