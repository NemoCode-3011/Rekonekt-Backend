import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createSectionService,
  getSectionsByExhibitionService,
  getSectionByIdService,
  updateSectionService,
  deleteSectionService,
} from "../service/sections.service";

export const createSectionController = async (req: Request,res: Response) => {
  const {
    exhibitionId,
    title,
    slug,
    introduction,
    sectionOrder,
    heroImageUrl,
  } = req.body;

  try {
    if (!exhibitionId) {
      return sendResponse(res, 400, "Exhibition ID is required");
    }

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    if (sectionOrder === undefined) {
      return sendResponse(res, 400, "Section order is required");
    }

    const result = await createSectionService({
      exhibitionId,
      title,
      slug,
      introduction,
      sectionOrder,
      heroImageUrl,
    });

    return sendResponse(
      res,
      201,
      "Section created successfully",
      result
    );
  } catch (error: any) {
    if (
      error.message === "Section slug or order already exists" ||
      error.message === "Exhibition not found"
    ) {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getSectionsByExhibitionController = async (req: Request, res: Response) => {
  try {
    const exhibitionId = Number(req.params.exhibitionId);

    if (Number.isNaN(exhibitionId)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result =
      await getSectionsByExhibitionService(exhibitionId);

    return sendResponse(
      res,
      200,
      "Sections retrieved successfully",
      result
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getSectionByIdController = async (req: Request,res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await getSectionByIdService(id);

    return sendResponse(
      res,
      200,
      "Section retrieved successfully",
      result
    );
  } catch (error: any) {
    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateSectionController = async (req: Request,res: Response) => {
  const {
    title,
    slug,
    introduction,
    sectionOrder,
    heroImageUrl,
  } = req.body;

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    if (!title || !slug) {
      return sendResponse(res, 400, "Title and slug are required");
    }

    if (sectionOrder === undefined) {
      return sendResponse(res, 400, "Section order is required");
    }

    const result = await updateSectionService(id, {
      title,
      slug,
      introduction,
      sectionOrder,
      heroImageUrl,
    });

    return sendResponse(
      res,
      200,
      "Section updated successfully",
      result
    );
  } catch (error: any) {
    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Section slug or order already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteSectionController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await deleteSectionService(id);

    return sendResponse(
      res,
      200,
      "Section deleted successfully",
      result
    );
  } catch (error: any) {
    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};