import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createStoryService,
  getStoriesBySectionService,
  getStoryByIdService,
  updateStoryService,
  deleteStoryService,
  publishStoryService,
  getStoryBySlugService,
  getDiscoveryStoryService,
  getAllStoriesBySectionService,
  getPublishedStoriesService,
} from "../service/stories.service";
import {
  updateStorySchema,
  createStorySchema,
} from "src/validation/story.schema";

export const createStoryController = async (req: Request, res: Response) => {
  try {
    const validation = createStorySchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { sectionId, title, slug, excerpt, content, coverImageUrl } =
      validation.data;

    const story = await createStoryService({
      sectionId,
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
    });

    return sendResponse(res, 201, "Story created successfully", story);
  } catch (error: any) {
    if (error.message === "Story slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    if (error.message === "Section not found") {
      return sendResponse(res, 404, error.message);
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
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid story ID");
    }

    const validation = updateStorySchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const story = await updateStoryService(
      id,
      validation.data as Parameters<typeof updateStoryService>[1],
    );

    return sendResponse(res, 200, "Story updated successfully", story);
  } catch (error: any) {
    if (error.message === "Story not found") {
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
export const getDiscoveryStoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getDiscoveryStoryService();

    return sendResponse(
      res,
      200,
      "Discovery story retrieved successfully",
      result,
    );
  } catch (error: any) {
    if (error.message === "Discovery story not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getStoryBySlugController = async (req: Request, res: Response) => {
  try {
    const result = await getStoryBySlugService(String(req.params.slug));

    return sendResponse(res, 200, "Story retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Story not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const publishStoryController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid story ID");
    }

    const result = await publishStoryService(id);

    return sendResponse(res, 200, "Story published successfully", result);
  } catch (error: any) {
    if (error.message === "Story not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getAdminStoriesBySectionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const sectionId = Number(req.params.sectionId);

    if (Number.isNaN(sectionId)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await getAllStoriesBySectionService(sectionId);

    return sendResponse(res, 200, "Stories retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
export const getPublishedStoriesController = async (req: Request,res: Response,) => {
  try {
    const result = await getPublishedStoriesService();

    return sendResponse(res, 200, "Stories retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
