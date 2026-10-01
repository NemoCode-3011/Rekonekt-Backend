import { Router } from "express";

import {
  createStoryController,
  getStoriesBySectionController,
  getStoryByIdController,
  updateStoryController,
  deleteStoryController,
} from "../controller/stories.controller";

import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createStoryController);

router.get("/sections/:sectionId", getStoriesBySectionController);

router.get("/:id", getStoryByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateStoryController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteStoryController);

export default router;
