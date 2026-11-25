import { Request, Response } from "express";
import {
  createAdminService,
  forgotPasswordService,
  getCurrentUserService,
  logoutService,
  resendOtpService,
  resetPasswordService,
  signUpService,
  verifyOtpService,
  updateProfileService,
  changePasswordService,
  getAdminsService,
  revokeAdminService,
  setupAdminPasswordService,
  AuthServiceError,
  signInService,
} from "../service/auth.service";
import { sendResponse } from "../utils/response";
import {
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
  updateProfileSchema,
  changePasswordSchema,
  createAdminSchema,
  setupAdminPasswordSchema,
  signInSchema,
} from "../validation/auth.schema";
import {
  sessionCookieOptions,
  clearSessionCookieOptions,
} from "../utils/cookies";

const authErrorStatus: Record<string, number> = {
  EMAIL_ALREADY_EXISTS: 409,
  EMAIL_REQUIRES_VERIFICATION: 409,
  EMAIL_NOT_VERIFIED: 403,
  INVALID_CREDENTIALS: 401,
  INVALID_OTP: 400,
  OTP_EXPIRED: 400,
  OTP_ATTEMPTS_EXCEEDED: 429,
  OTP_COOLDOWN: 429,
  OTP_DELIVERY_FAILED: 503,
  CURRENT_PASSWORD_INCORRECT: 400,
  USER_NOT_FOUND: 404,
};

const sendAuthResponse = (
  res: Response,
  status: number,
  code: string,
  message: string,
  data: unknown = null,
) => sendResponse(res, status, message, data, code);

const sendAuthError = (res: Response, error: unknown) => {
  if (error instanceof AuthServiceError) {
    return sendAuthResponse(
      res,
      authErrorStatus[error.code] ?? 500,
      error.code,
      error.message,
      error.details,
    );
  }

  const errorName = error instanceof Error ? error.name : "UnknownError";
  const errorCode =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : "UNEXPECTED_ERROR";
  console.error("Authentication request failed", { errorName, errorCode });
  return sendAuthResponse(res, 500, "INTERNAL_ERROR", "Internal server error");
};

export const signUpController = async (req: Request, res: Response) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const { name, email, password, preferredLanguage } = validation.data;

    const user = await signUpService({
      name,
      email,
      password,
      preferredLanguage,
    });

    return sendAuthResponse(
      res,
      201,
      "OTP_SENT",
      "Verification code sent",
      user,
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const validation = verifyOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const { email, otp } = validation.data;
    const results = await verifyOtpService({ email, otp });

    return sendAuthResponse(
      res,
      200,
      "EMAIL_VERIFIED",
      "OTP verified successfully",
      results,
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const validation = signInSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const { email, password } = validation.data;
    const results = await signInService({
      email,
      password,
    });
    res.cookie("sessionId", results.sessionId, sessionCookieOptions);

    return sendAuthResponse(res, 200, "LOGIN_SUCCESS", "Login successful", {
      id: results.id,
      name: results.name,
      email: results.email,
      role: results.role,
      preferred_language: results.preferred_language,
      is_verified: results.is_verified,
    });
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const results = await getCurrentUserService(req.userId);

    return sendResponse(res, 200, "User retrieved successfully", results);
  } catch (error: any) {
    if (error.message === "User not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return sendResponse(res, 401, "Authentication required");
    }

    await logoutService(sessionId);

    res.clearCookie("sessionId", clearSessionCookieOptions);

    return sendResponse(res, 200, "Logout successful");
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const createAdminController = async (req: Request, res: Response) => {
  try {
    const validation = createAdminSchema.safeParse(req.body);
    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const results = await createAdminService(validation.data);

    return sendResponse(
      res,
      201,
      "Admin created and password setup email sent",
      results,
    );
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return sendResponse(res, 409, error.message);
    }

    if (error.message === "EMAIL_SEND_FAILED") {
      return sendResponse(
        res,
        502,
        "The invitation email could not be sent, so the admin was not added. Check the email settings and try again.",
      );
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const setupAdminPasswordController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = setupAdminPasswordSchema.safeParse(req.body);
    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { token, password } = validation.data;
    const admin = await setupAdminPasswordService(token, password);

    return sendResponse(res, 200, "Admin password set successfully", admin);
  } catch (error: any) {
    if (error.message === "Invalid or expired setup link") {
      return sendResponse(res, 400, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const resendOtpController = async (req: Request, res: Response) => {
  try {
    const validation = resendOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { email } = validation.data;

    const result = await resendOtpService(email);

    return sendAuthResponse(
      res,
      200,
      "OTP_REQUEST_ACCEPTED",
      "If verification is needed, check your email",
      result,
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const validation = resendOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const { email } = validation.data;
    const result = await forgotPasswordService(email);

    return sendAuthResponse(
      res,
      200,
      "PASSWORD_RESET_REQUEST_ACCEPTED",
      "If the account exists, a reset code will be sent if eligible",
      result,
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const validation = resetPasswordSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const { email, otp, newPassword } = validation.data;

    const result = await resetPasswordService(email, otp, newPassword);

    return sendAuthResponse(
      res,
      200,
      "PASSWORD_RESET",
      "Password reset successfully",
      result,
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return sendAuthResponse(
        res,
        400,
        "VALIDATION_ERROR",
        validation.error.issues[0].message,
      );
    }

    const user = await updateProfileService(req.userId, validation.data);

    return sendResponse(res, 200, "Profile updated successfully", user);
  } catch (error: any) {
    if (error.message === "User not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Cultural group not found") {
      return sendResponse(res, 400, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = changePasswordSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    await changePasswordService(
      req.userId,
      validation.data.currentPassword,
      validation.data.newPassword,
      req.cookies.sessionId,
    );
    return sendAuthResponse(
      res,
      200,
      "PASSWORD_CHANGED",
      "Password changed successfully",
    );
  } catch (error) {
    return sendAuthError(res, error);
  }
};

export const getAdminsController = async (_req: Request, res: Response) => {
  try {
    const admins = await getAdminsService();

    return sendResponse(res, 200, "Admins retrieved successfully", admins);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const revokeAdminController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid user ID");
    }

    const admin = await revokeAdminService(id, req.userId as number);

    return sendResponse(res, 200, "Admin access removed", admin);
  } catch (error: any) {
    if (error.message === "Admin not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "You can't remove your own access") {
      return sendResponse(res, 400, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};