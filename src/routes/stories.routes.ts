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
} from "../controller/stories.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";


const router = Router();

router.get("/discovery", getDiscoveryStoryController);
router.get("/sections/:sectionId", getStoriesBySectionController);
router.get("/:slug", getStoryBySlugController);
router.get("/admin/sections/:sectionId",verifyUser,requireRole("admin", "super admin"), getAdminStoriesBySectionController,);
router.post("/", verifyUser, requireRole("admin", "super admin"), createStoryController);
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), publishStoryController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateStoryController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteStoryController);

export default router;
