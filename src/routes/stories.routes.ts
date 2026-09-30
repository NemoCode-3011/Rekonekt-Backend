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

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createStoryController);

router.get("/sections/:sectionId", getStoriesBySectionController);

router.get("/:id", getStoryByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateStoryController);

router.delete("/:id", verifyUser, requireSuperAdmin, deleteStoryController);

export default router;
