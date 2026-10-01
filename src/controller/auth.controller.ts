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
} from "../service/auth.service";
import { sendResponse } from "../utils/response";
import { signInService } from "src/service/auth.service";
import { deleteExhibitionService } from "src/service/exhibitions.service";

export const signUpController = async (req: Request, res: Response) => {
  try {
    const { name, email, password, preferredLanguage } = req.body ?? {};

    if (!name || typeof name !== "string") {
      return sendResponse(res, 400, "Name is required");
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return sendResponse(res, 400, "Valid email is required");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return sendResponse(res, 400, "Password must be at least 8 characters");
    }

    const user = await signUpService({
      name,
      email,
      password,
      preferredLanguage,
    });

    return sendResponse(res, 201, "Registration successful", user);
  } catch (error: any) {
    if (error.message === "Email already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.error("Signup error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    if (!email || !email.includes("@")) {
      return sendResponse(res, 400, "Valid email required");
    }
    if (!otp || otp.length !== 6) {
      return sendResponse(res, 400, "Valid OTP required");
    }

    const results = await verifyOtpService({ email, otp });

    // success response

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
  const { email, password } = req.body;

  try {
    if (!email || !email.includes("@")) {
      return sendResponse(res, 400, "Valid email required");
    }

    if (!password) {
      return sendResponse(res, 400, "Password is required");
    }

    const results = await signInService({
      email,
      password,
    });

    res.cookie("sessionId", results.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

    res.clearCookie("sessionId", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

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

export const deleteExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result = await deleteExhibitionService(id);

    return sendResponse(res, 200, "Exhibition deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
export const resendOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, "Email is required");
    }

    const result = await resendOtpService(email);

    return sendResponse(res, 200, "Verification OTP sent successfully", result);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 400, error.message || "Failed to resend OTP");
  }
};
export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, 400, "Email is required");
    }

    await forgotPasswordService(email);

    return sendResponse(res, 200, "Password reset OTP sent successfully");
  } catch (error: any) {
    return sendResponse(res, 400, error.message || "Failed to send reset OTP");
  }
};
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return sendResponse(res, 400, "Email, OTP and new password are required");
    }

    const user = await resetPasswordService(email, otp, newPassword);

    return sendResponse(res, 200, "Password reset successfully", user);
  } catch (error: any) {
    return sendResponse(res, 400, error.message || "Failed to reset password");
  }
};
