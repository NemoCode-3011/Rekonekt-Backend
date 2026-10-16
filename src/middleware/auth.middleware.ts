import { Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";
import { sendResponse } from "../utils/response";
import { SESSION_TTL_SECONDS } from "../utils/sessions";
import { sessionCookieOptions } from "../utils/cookies";

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

      // Slide the cookie forward too, so it expires with the session.
      res.cookie("sessionId", sessionId, sessionCookieOptions);

      req.userId = userId;

      next();
    } catch (error: any) {
      console.log(error.message || error);

      return sendResponse(res, 500, "Internal server error");
    }
  };

export const verifyUser = createSessionVerifier("Authentication required");

// For public pages that anyone may read. A visitor with a valid session is
// recognised, Everyone else carries on as an anonymous visitor: no 401.
// If Redis is down, the visitor is treated as anonymous too, so a public
// page never fails just because sessions are unavailable.
export const optionalSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      const session = await redisClient.get(`session:${sessionId}`);

      if (session) {
        const { userId } = JSON.parse(session);

        await redisClient.expire(`session:${sessionId}`, SESSION_TTL_SECONDS);
        res.cookie("sessionId", sessionId, sessionCookieOptions);

        req.userId = userId;
      }
    }
  } catch (error: any) {
    console.log(error.message || error);
  }

  // Called outside the try block so an error further down the road is
  // never swallowed here.
  next();
};
