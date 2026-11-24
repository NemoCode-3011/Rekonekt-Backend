import { Router } from "express";
import {
  forgotPasswordController,
  getCurrentUserController,
  logoutController,
  resendOtpController,
  resetPasswordController,
  signInController,
  signUpController,
  verifyOtpController,
  updateProfileController,
  changePasswordController,
  setupAdminPasswordController,
} from "../controller/auth.controller";
import { verifyUser } from "../middleware/auth.middleware";
import {
  adminSetupLimiter,
  otpResendLimiter,
  otpVerificationLimiter,
  passwordChangeLimiter,
  passwordResetLimiter,
  passwordResetRequestLimiter,
  signinLimiter,
  signupLimiter,
} from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/signup", signupLimiter, signUpController);
router.post("/verify-otp", otpVerificationLimiter, verifyOtpController);
router.post("/signin", signinLimiter, signInController);
router.post(
  "/admin/setup-password",
  adminSetupLimiter,
  setupAdminPasswordController,
);
router.get("/me", verifyUser, getCurrentUserController);
router.patch("/me", verifyUser, updateProfileController);
router.post(
  "/change-password",
  verifyUser,
  passwordChangeLimiter,
  changePasswordController,
);
router.post("/logout", logoutController);
router.post("/resend-otp", otpResendLimiter, resendOtpController);
router.post(
  "/forgot-password",
  passwordResetRequestLimiter,
  forgotPasswordController,
);
router.post("/reset-password", passwordResetLimiter, resetPasswordController);
export default router;
