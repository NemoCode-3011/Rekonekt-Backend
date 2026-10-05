import { Router } from "express";

import {
  createStoryController,
  getStoriesBySectionController,
  getAdminStoriesBySectionController,
  updateStoryController,
  deleteStoryController,
  publishStoryController,
  getStoryBySlugController,
  getDiscoveryStoryController,
  getPublishedStoriesController
} from "../controller/stories.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";
import { createAdminContentController } from "src/controller/adminContent.controller";

const router = Router();

const admin = createAdminContentController("stories", "Story");

router.get("/", getPublishedStoriesController);
router.get("/discovery", getDiscoveryStoryController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), admin.list);
router.get("/admin/sections/:sectionId", verifyUser, requireRole("admin", "super admin"), getAdminStoriesBySectionController);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), admin.getById);
router.get("/sections/:sectionId", getStoriesBySectionController);
router.get("/:slug", getStoryBySlugController);

router.post("/", verifyUser, requireRole("admin", "super admin"), createStoryController);
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), publishStoryController);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateStoryController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteStoryController);

export default router;
