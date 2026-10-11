import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { sendResponse } from "../utils/response";

export const notFoundHandler = (_req: Request, res: Response) => {
  return sendResponse(res, 404, "Route not found");
};

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Bad uploads are the client's mistake, not a server crash.
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large (10 MB max)"
        : error.message;

    return sendResponse(res, 400, message);
  }

  if (error?.message === "Unsupported file type") {
    return sendResponse(res, 400, error.message);
  }

  if (error?.type === "entity.parse.failed") {
    return sendResponse(res, 400, "Invalid JSON body");
  }

  console.error(error);

  return sendResponse(res, 500, "Internal server error");
};
