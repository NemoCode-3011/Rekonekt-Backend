import { Router } from "express";
import {
  createAdminController,
  getCurrentUserController,
  logoutController,
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
export default router;
