import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import { authenticateWithGoogle } from "src/service/googleAuth.service";
import { googleAuthSchema } from "src/validation/auth.schema";
import { sessionCookieOptions } from "../utils/cookies";

export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const validation = googleAuthSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { credential } = validation.data;

    const result = await authenticateWithGoogle(credential);

    res.cookie("sessionId", result.sessionId, sessionCookieOptions);

    return sendResponse(
      res,
      200,
      "Google authentication successful",
      result.user,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 401, "Google authentication failed");
  }
};
