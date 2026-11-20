import { requireRole } from "@middleware/authorize";
import { Router } from "express";
import { getAdminEventMediaController } from "../controller/mediaAttachment.controller";
import { verifyUser } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/admin/events/:eventId/media",
  verifyUser,
  requireRole("admin", "super admin"),
  getAdminEventMediaController,
);

export default router;
