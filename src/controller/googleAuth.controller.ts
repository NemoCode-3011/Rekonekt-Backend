import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import { authenticateWithGoogle } from "src/service/googleAuth.service";

export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return sendResponse(res, 400, "Google credential is required");
    }

    const result = await authenticateWithGoogle(credential);

    res.cookie("sessionId", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
