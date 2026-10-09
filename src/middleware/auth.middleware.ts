import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { sendResponse } from "../utils/response";
import { SESSION_TTL_SECONDS } from "../utils/sessions";

const createSessionVerifier =
  (missingSessionMessage: string, missingSessionData: unknown = null) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        return sendResponse(
          res,
          401,
          missingSessionMessage,
          missingSessionData,
        );
      }

      const session = await redisClient.get(`session:${sessionId}`);
      if (!session) {
        return sendResponse(res, 401, "Session expired or invalid");
      }

      const { userId } = JSON.parse(session);

      // Every request restarts the 24-hour timer, so only inactivity ends a session.
      await redisClient.expire(`session:${sessionId}`, SESSION_TTL_SECONDS);

      req.userId = userId;

      next();
    } catch (error: any) {
      console.log(error.message || error);

      return sendResponse(res, 500, "Internal server error");
    }
  };

export const verifyUser = createSessionVerifier("Authentication required");
export const requireExhibitionSignup = createSessionVerifier(
  "Sign up or sign in to view the full exhibition",
  { code: "SIGNUP_REQUIRED" },
);
