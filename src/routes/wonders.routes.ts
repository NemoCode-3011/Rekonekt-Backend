import { Router } from "express";
import {
  createWonderController,
  updateWonderController,
  deleteWonderController,
  getPublishedWondersController,
  getWonderBySlugController,
  getAdminWonderByIdController,
} from "../controller/wonders.controller";
import { createAdminContentController } from "../controller/adminContent.controller";
import { optionalSession, verifyUser } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/authorize";

const router = Router();

// List, publish and unpublish work the same for every kind of content.
const admin = createAdminContentController("wonders", "Wonder");
const adminOnly = [verifyUser, requireRole("admin", "super admin")];

router.get("/", optionalSession, getPublishedWondersController);

// These must stay above "/:slug", or "admin" would be read as a wonder's slug.
router.get("/admin", ...adminOnly, admin.list);
router.get("/admin/:id", ...adminOnly, getAdminWonderByIdController);

router.get("/:slug", optionalSession, getWonderBySlugController);

router.post("/", ...adminOnly, createWonderController);
router.patch("/:id/publish", ...adminOnly, admin.publish);
router.patch("/:id/unpublish", ...adminOnly, admin.unpublish);
router.patch("/:id", ...adminOnly, updateWonderController);
router.delete("/:id", ...adminOnly, deleteWonderController);

export default router;