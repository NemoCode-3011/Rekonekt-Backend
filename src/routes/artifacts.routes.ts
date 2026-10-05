import { Router } from "express";
import {
  createArtifactController,
  getArtifactsController,
  getArtifactsBySectionController,
  getArtifactBySlugController,
  updateArtifactController,
  deleteArtifactController,
} from "../controller/artifacts.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";
import { createAdminContentController } from "src/controller/adminContent.controller";

const router = Router();

const admin = createAdminContentController("artifacts", "Artifact");
// admin routes for managing artifacts
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), admin.publish);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);

router.post("/", verifyUser, requireRole("admin", "super admin"), createArtifactController);
router.get("/", getArtifactsController);
router.get("/sections/:sectionId", getArtifactsBySectionController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), admin.list);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), admin.getById);
router.get("/:slug", getArtifactBySlugController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateArtifactController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteArtifactController);

export default router;
