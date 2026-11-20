import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/response";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

export const verifyRequestOrigin =
  (allowedOrigin: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (safeMethods.has(req.method)) {
      return next();
    }

    const origin = req.get("origin");
    if (!origin || origin === allowedOrigin) {
      return next();
    }

    return sendResponse(res, 403, "Invalid request origin");
  };
