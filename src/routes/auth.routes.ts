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
  changePasswordController
} from "../controller/auth.controller";
import { verifyUser } from "@middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/signup", authLimiter, signUpController);
router.post("/verify-otp", authLimiter, verifyOtpController);
router.post("/signin", authLimiter, signInController);
router.get("/me", verifyUser, getCurrentUserController);
router.patch("/me", verifyUser, updateProfileController);
router.post("/change-password", verifyUser, authLimiter, changePasswordController);
router.post("/logout", logoutController);
router.post("/resend-otp", authLimiter, resendOtpController);
router.post("/forgot-password", authLimiter, forgotPasswordController);
router.post("/reset-password", authLimiter, resetPasswordController);
export default router;
