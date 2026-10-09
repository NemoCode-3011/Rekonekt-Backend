import { verifyUser } from "@middleware/auth.middleware";
import { requireSuperAdmin } from "@middleware/role.middleware";
import { Router } from "express";
import {
  createAdminController,
  getAdminsController,
  revokeAdminController,
} from "src/controller/auth.controller";

const router = Router();

router.get("/admins", verifyUser, requireSuperAdmin, getAdminsController);
router.post("/admins", verifyUser, requireSuperAdmin, createAdminController);
router.patch("/admins/:id/revoke", verifyUser, requireSuperAdmin, revokeAdminController);

export default router;