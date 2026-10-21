import { Router } from "express";

import {
  createStoryController,
  getStoriesBySectionController,
  getAdminStoriesBySectionController,
  updateStoryController,
  deleteStoryController,
  publishStoryController,
  getStoryBySlugController,
  getPublishedStoriesController,
  getDidYouKnowStoryController,
  getAdminStoriesController,
  getAdminStoryByIdController,
} from "../controller/stories.controller";
import {
  optionalSession,
  verifyUser,
} from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";
import { createAdminContentController } from "src/controller/adminContent.controller";

const router = Router();

const admin = createAdminContentController("stories", "Story");

router.get("/", optionalSession, getPublishedStoriesController);
// Must stay above "/:slug", or "did-you-know" would be read as a story slug.
router.get("/did-you-know", optionalSession, getDidYouKnowStoryController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), getAdminStoriesController);
router.get("/admin/sections/:sectionId", verifyUser, requireRole("admin", "super admin"), getAdminStoriesBySectionController);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), getAdminStoryByIdController);
router.get("/sections/:sectionId", optionalSession, getStoriesBySectionController);
router.get("/:slug", optionalSession, getStoryBySlugController);

router.post("/", verifyUser, requireRole("admin", "super admin"), createStoryController);
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), publishStoryController);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateStoryController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteStoryController);

export default router;