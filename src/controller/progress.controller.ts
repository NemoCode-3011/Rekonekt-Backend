import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createProgressService,
  getProgressByUserService,
  getProgressByExhibitionService,
  updateProgressService,
  deleteProgressService,
} from "src/service/progress.service";
import {
  createProgressSchema,
  updateProgressSchema,
} from "src/validation/progress.schema";

export const createProgressController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = createProgressSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { exhibitionId, sectionId, completed } = validation.data;

    const progress = await createProgressService(
      req.userId,
      exhibitionId,
      sectionId || null,
      completed ?? false,
    );

    return sendResponse(res, 201, "Progress created successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(
        res,
        409,
        "Progress already exists for this exhibition",
      );
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Exhibition or section not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};
export const getProgressController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const progress = await getProgressByUserService(req.userId);

    return sendResponse(res, 200, "Progress retrieved successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getProgressByExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const exhibitionId = Number(req.params.exhibitionId);

    if (!Number.isInteger(exhibitionId) || exhibitionId <= 0) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const progress = await getProgressByExhibitionService(
      req.userId,
      exhibitionId,
    );

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress retrieved successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateProgressController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const exhibitionId = Number(req.params.exhibitionId);

    if (!Number.isInteger(exhibitionId) || exhibitionId <= 0) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const validation = updateProgressSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { sectionId, completed } = validation.data;

    const progress = await updateProgressService(
      req.userId,
      exhibitionId,
      sectionId ?? null,
      completed ?? false,
    );

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress updated successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteProgressController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const exhibitionId = Number(req.params.exhibitionId);

    if (!Number.isInteger(exhibitionId) || exhibitionId <= 0) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const progress = await deleteProgressService(req.userId, exhibitionId);

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress deleted successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
