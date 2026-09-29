import { verifyUser } from "@middleware/auth.middleware";
import { requireSuperAdmin } from "@middleware/role.middleware";
import { Router } from "express";
import { createAdminController } from "src/controller/auth.controller";

const router = Router()
router.post("/admins", verifyUser, requireSuperAdmin, createAdminController);
export default router