import { Request, Response } from "express";
import {
  getPublishedExhibitionsService,
  getExhibitionBySlugService,
  createExhibitionService,
  publishExhibitionService,
  updateExhibitionService,
} from "../service/exhibitions.service";
import { sendResponse } from "src/utils/response";

export const getPublishedExhibitionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const results = await getPublishedExhibitionsService();

    return sendResponse(
      res,
      200,
      "Exhibitions retrieved successfully",
      results,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getExhibitionBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;

    const result = await getExhibitionBySlugService(slug);

    return sendResponse(res, 200, "Exhibition retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const createExhibitionController = async (
  req: Request,
  res: Response,
) => {
  const {
    title,
    slug,
    subtitle,
    description,
    startDate,
    endDate,
    coverImageUrl,
  } = req.body;

  try {
    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    const result = await createExhibitionService({
      title,
      slug,
      subtitle,
      description,
      startDate,
      endDate,
      coverImageUrl,
    });

    return sendResponse(res, 201, "Exhibition created successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const publishExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result = await publishExhibitionService(id);

    return sendResponse(res, 200, "Exhibition published successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateExhibitionController = async (
  req: Request,
  res: Response,
) => {
  const {
    title,
    slug,
    subtitle,
    description,
    startDate,
    endDate,
    coverImageUrl,
  } = req.body;

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    const result = await updateExhibitionService(id, {
      title,
      slug,
      subtitle,
      description,
      startDate,
      endDate,
      coverImageUrl,
    });

    return sendResponse(res, 200, "Exhibition updated successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Exhibition slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
