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
} from "../controller/auth.controller";
import { verifyUser } from "@middleware/auth.middleware";

const router = Router();

router.post("/signup", signUpController);
router.post("/verify-otp", verifyOtpController);
router.post("/signin", signInController);
router.get("/me", verifyUser, getCurrentUserController);
router.post("/logout", logoutController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
export default router;
