import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createStoryService,
  getStoriesBySectionService,
  getStoryByIdService,
  updateStoryService,
  deleteStoryService,
} from "../service/stories.service";

export const createStoryController = async (req: Request, res: Response) => {
  const { sectionId, title, slug, excerpt, content, coverImageUrl } = req.body;

  try {
    if (!sectionId) {
      return sendResponse(res, 400, "Section ID is required");
    }

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    const result = await createStoryService({
      sectionId,
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
    });

    return sendResponse(res, 201, "Story created successfully", result);
  } catch (error: any) {
    if (
      error.message === "Story slug already exists" ||
      error.message === "Section not found"
    ) {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getStoriesBySectionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const sectionId = Number(req.params.sectionId);

    if (Number.isNaN(sectionId)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await getStoriesBySectionService(sectionId);

    return sendResponse(res, 200, "Stories retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getStoryByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid story ID");
    }

    const result = await getStoryByIdService(id);

    return sendResponse(res, 200, "Story retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Story not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateStoryController = async (req: Request, res: Response) => {
  const { sectionId, title, slug, excerpt, content, coverImageUrl } = req.body;

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid story ID");
    }

    if (!sectionId) {
      return sendResponse(res, 400, "Section ID is required");
    }

    if (!title || !slug) {
      return sendResponse(res, 400, "Title and slug are required");
    }

    const result = await updateStoryService(id, {
      sectionId,
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
    });

    return sendResponse(res, 200, "Story updated successfully", result);
  } catch (error: any) {
    if (
      error.message === "Story not found" ||
      error.message === "Section not found"
    ) {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Story slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteStoryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid story ID");
    }

    const result = await deleteStoryService(id);

    return sendResponse(res, 200, "Story deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Story not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
