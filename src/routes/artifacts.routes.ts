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
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createArtifactController);

router.get("/", getArtifactsController);

router.get("/sections/:sectionId", getArtifactsBySectionController);

router.get("/:id", getArtifactByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateArtifactController);

router.delete("/:id", verifyUser, requireSuperAdmin, deleteArtifactController);

export default router;
