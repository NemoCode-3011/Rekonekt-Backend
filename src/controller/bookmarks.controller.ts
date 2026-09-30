import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createBookmark,
  getBookmarksByUser,
  getBookmarkById,
  deleteBookmark,
} from "../service/bookmarks.service";

export const createBookmarkController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { artifactId } = req.body;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    if (!artifactId) {
      return sendResponse(res, 400, "Artifact ID is required");
    }

    const bookmark = await createBookmark(userId, Number(artifactId));

    return sendResponse(res, 201, "Bookmark created successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Artifact already bookmarked");
    }

    return sendResponse(res, 500, "Failed to create bookmark");
  }
};

export const getBookmarksController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const bookmarks = await getBookmarksByUser(userId);

    return sendResponse(
      res,
      200,
      "Bookmarks retrieved successfully",
      bookmarks,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve bookmarks");
  }
};

export const getBookmarkByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const bookmark = await getBookmarkById(id, userId);

    if (!bookmark) {
      return sendResponse(res, 404, "Bookmark not found");
    }

    return sendResponse(res, 200, "Bookmark retrieved successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve bookmark");
  }
};

export const deleteBookmarkController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const bookmark = await deleteBookmark(id, userId);

    if (!bookmark) {
      return sendResponse(res, 404, "Bookmark not found");
    }

    return sendResponse(res, 200, "Bookmark deleted successfully", bookmark);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to delete bookmark");
  }
};
