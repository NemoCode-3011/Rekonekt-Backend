import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createProgress,
  getProgressByUser,
  getProgressByExhibition,
  updateProgress,
  deleteProgress,
} from "src/service/progress.service";

export const createProgressController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { exhibitionId, sectionId, completed } = req.body;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    if (!exhibitionId) {
      return sendResponse(res, 400, "Exhibition ID is required");
    }

    const progress = await createProgress(
      userId,
      Number(exhibitionId),
      sectionId ? Number(sectionId) : null,
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

    return sendResponse(res, 500, "Failed to create progress");
  }
};

export const getProgressController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const progress = await getProgressByUser(userId);

    return sendResponse(res, 200, "Progress retrieved successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve progress");
  }
};

export const getProgressByExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const exhibitionId = Number(req.params.exhibitionId);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const progress = await getProgressByExhibition(userId, exhibitionId);

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress retrieved successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve progress");
  }
};

export const updateProgressController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const exhibitionId = Number(req.params.exhibitionId);

    const { sectionId, completed } = req.body;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const progress = await updateProgress(
      userId,
      exhibitionId,
      sectionId ? Number(sectionId) : null,
      completed ?? false,
    );

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress updated successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to update progress");
  }
};

export const deleteProgressController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const exhibitionId = Number(req.params.exhibitionId);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const progress = await deleteProgress(userId, exhibitionId);

    if (!progress) {
      return sendResponse(res, 404, "Progress not found");
    }

    return sendResponse(res, 200, "Progress deleted successfully", progress);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to delete progress");
  }
};
