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
} from "../service/auth.service";
import { sendResponse } from "../utils/response";
import { signInService } from "src/service/auth.service";
import {
  resendOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verifyOtpSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "src/validation/auth.schema";
import { signInSchema } from "src/validation/auth.schema";
import {
  sessionCookieOptions,
  clearSessionCookieOptions,
} from "../utils/cookies";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { name, email, password, preferredLanguage } = validation.data;

    const user = await signUpService({
      name,
      email,
      password,
      preferredLanguage,
    });

    return sendResponse(res, 201, "User created successfully", user);
  } catch (error: any) {
    console.log(error.message || error);
    if (error.message === "Email already exists") {
      return sendResponse(res, 409, "Email already exists");
    }
    return sendResponse(res, 500, "Internal server error");
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const validation = verifyOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { email, otp } = validation.data;
    const results = await verifyOtpService({ email, otp });

    return sendResponse(res, 200, "OTP verified successfully", results);
  } catch (error: any) {
    if (error.message === "Invalid or expired OTP") {
      return sendResponse(res, 400, error.message);
    }
    console.log(error.message || error);
    return sendResponse(res, 500, "internal server error");
  }
};

export const signInController = async (req: Request, res: Response) => {
  try {
    const validation = signInSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { email, password } = validation.data;
    const results = await signInService({
      email,
      password,
    });
    res.cookie("sessionId", results.sessionId, sessionCookieOptions);

    return sendResponse(res, 200, "Login successful", {
      id: results.id,
      name: results.name,
      email: results.email,
      role: results.role,
      preferred_language: results.preferred_language,
      is_verified: results.is_verified,
    });
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      return sendResponse(res, 401, error.message);
    }

    if (error.message === "Please verify your email first") {
      return sendResponse(res, 403, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
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
  const { name, email, password, preferredLanguage } = req.body;
  try {
    if (!name) {
      return sendResponse(res, 400, "Name is required");
    }

    if (!email || !email.includes("@")) {
      return sendResponse(res, 400, "Valid email is required");
    }

    if (!password || password.length < 8) {
      return sendResponse(
        res,
        400,
        "Password must not be less than 8 characters",
      );
    }

    const results = await createAdminService({
      name,
      email,
      password,
      preferredLanguage,
    });

    return sendResponse(res, 201, "Admin created successfully", results);
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return sendResponse(res, 409, error.message);
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

    return sendResponse(res, 200, "Verification OTP sent successfully", result);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 400, error.message || "Failed to resend OTP");
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const validation = resendOtpSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { email } = validation.data;
    await forgotPasswordService(email);

    return sendResponse(res, 200, "Password reset OTP sent successfully");
  } catch (error: any) {
    return sendResponse(res, 400, error.message || "Failed to send reset OTP");
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const validation = resetPasswordSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { email, otp, newPassword } = validation.data;

    const result = await resetPasswordService(email, otp, newPassword);

    return sendResponse(res, 200, "Password reset successfully", result);
  } catch (error: any) {
    return sendResponse(res, 400, error.message || "Failed to reset password");
  }
};
export const updateProfileController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = updateProfileSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
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
    );

    return sendResponse(res, 200, "Password changed successfully");
  } catch (error: any) {
    if (error.message === "Current password is incorrect") {
      return sendResponse(res, 400, error.message);
    }

    if (error.message === "User not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
