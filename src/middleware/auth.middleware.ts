import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { sendResponse } from "../utils/response";
import { SESSION_TTL_SECONDS } from "../utils/sessions";
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

    // Every request restarts the 24-hour timer, so only inactivity of the user ends a session(omo hope it wokrs).
    await redisClient.expire(`session:${sessionId}`, SESSION_TTL_SECONDS);

    req.userId = userId;

    next();
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
