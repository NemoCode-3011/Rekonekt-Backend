import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createSectionService,
  getSectionsByExhibitionService,
  getSectionByIdService,
  updateSectionService,
  deleteSectionService,
} from "../service/sections.service";
import {
  createSectionSchema,
  updateSectionSchema,
} from "src/validation/section.schema";

export const createSectionController = async (req: Request, res: Response) => {
  try {
    const validation = createSectionSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      exhibitionId,
      title,
      slug,
      introduction,
      sectionOrder,
      heroImageUrl,
    } = validation.data;

    const section = await createSectionService({
      exhibitionId,
      title,
      slug,
      introduction,
      sectionOrder,
      heroImageUrl,
    });

    return sendResponse(res, 201, "Section created successfully", section);
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

export const getSectionsByExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const exhibitionId = Number(req.params.exhibitionId);

    if (Number.isNaN(exhibitionId)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result = await getSectionsByExhibitionService(exhibitionId);

    return sendResponse(res, 200, "Sections retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getSectionByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await getSectionByIdService(id);

    return sendResponse(res, 200, "Section retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateSectionController = async (req: Request, res: Response) => {
  try {
    const validation = updateSectionSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const section = await updateSectionService(
      Number(req.params.id),
      validation.data as Parameters<typeof updateSectionService>[1],
    );

    return sendResponse(res, 200, "Section updated successfully", section);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Section slug already exists");
    }

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

    return sendResponse(res, 200, "Section deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
