import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createBookmarkService,
  getBookmarksByUserService,
  getBookmarkByIdService,
  deleteBookmarkService,
} from "../service/bookmarks.service";
import { createBookmarkSchema } from "../validation/bookmark.schema";
export const createBookmarkController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = createBookmarkSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { artifactId } = validation.data;

    const bookmark = await createBookmarkService(req.userId, artifactId);

    return sendResponse(res, 201, "Bookmark created successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Artifact already bookmarked");
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Artifact not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getBookmarksController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const bookmarks = await getBookmarksByUserService(req.userId);

    return sendResponse(
      res,
      200,
      "Bookmarks retrieved successfully",
      bookmarks,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getBookmarkByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendResponse(res, 400, "Invalid bookmark ID");
    }

    const bookmark = await getBookmarkByIdService(id, req.userId);

    if (!bookmark) {
      return sendResponse(res, 404, "Bookmark not found");
    }

    return sendResponse(res, 200, "Bookmark retrieved successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteBookmarkController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendResponse(res, 400, "Invalid bookmark ID");
    }

    const bookmark = await deleteBookmarkService(id, req.userId);

    if (!bookmark) {
      return sendResponse(res, 404, "Bookmark not found");
    }

    return sendResponse(res, 200, "Bookmark deleted successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
