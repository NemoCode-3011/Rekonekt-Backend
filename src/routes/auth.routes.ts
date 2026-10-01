import { Router } from "express";
import {
  createAdminController,
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
import { requireSuperAdmin } from "@middleware/role.middleware";

const router = Router();

router.post("/signup", signUpController);
router.post("/verify-otp", verifyOtpController);
router.post("/signin", signInController);
router.get("/me", verifyUser, getCurrentUserController);
router.post("/logout", logoutController);
router.post("/admins", verifyUser, requireSuperAdmin, createAdminController);
router.post("/resend-otp", resendOtpController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
export default router;
