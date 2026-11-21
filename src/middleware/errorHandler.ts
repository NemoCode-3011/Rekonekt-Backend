import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { sendResponse } from "../utils/response";
import { RateLimitStoreUnavailableError } from "../utils/rateLimitStore";

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

  if (error instanceof RateLimitStoreUnavailableError) {
    const cause = error.originalError;
    const errorName = cause instanceof Error ? cause.name : "UnknownError";
    const errorCode =
      typeof cause === "object" &&
      cause !== null &&
      "code" in cause &&
      typeof cause.code === "string"
        ? cause.code
        : "UNKNOWN_ERROR";
    console.error("Rate limit store request failed", { errorName, errorCode });

    return sendResponse(
      res,
      503,
      "Rate limiting is temporarily unavailable",
      null,
      "RATE_LIMIT_STORE_UNAVAILABLE",
    );
  }

  console.error(error);

  return sendResponse(res, 500, "Internal server error");
};
