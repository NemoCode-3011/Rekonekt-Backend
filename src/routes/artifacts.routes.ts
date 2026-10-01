import { Router } from "express";
import {
  createArtifactController,
  getArtifactsController,
  getArtifactsBySectionController,
  getArtifactByIdController,
  updateArtifactController,
  deleteArtifactController,
} from "../controller/artifacts.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createArtifactController);

router.get("/", getArtifactsController);

router.get("/sections/:sectionId", getArtifactsBySectionController);

router.get("/:id", getArtifactByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateArtifactController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteArtifactController);

export default router;
