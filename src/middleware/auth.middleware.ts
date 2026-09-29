import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { sendResponse } from "../utils/response";

export const verifyUser = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const session = await redisClient.get(`session:${sessionId}`);

    if (!session) {
      return sendResponse(res, 401, "Session expired or invalid");
    }

    const { userId } = JSON.parse(session);

    req.userId = userId;

    next();
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
