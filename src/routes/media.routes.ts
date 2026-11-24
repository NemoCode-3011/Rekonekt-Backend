import { Router } from "express";
import {
  createMediaController,
  createYouTubeMediaController,
  getMediaController,
  getMediaByIdController,
  updateMediaController,
  deleteMediaController,
  uploadMediaController,
} from "../controller/media.controller";
import {
  optionalSession,
  verifyUser,
} from "../middleware/auth.middleware";
import { uploadMediaFile } from "../middleware/upload.middleware";
import { requireRole } from "../middleware/authorize";

const router = Router();

router.post(
  "/youtube",
  verifyUser,
  requireRole("admin", "super admin"),
  createYouTubeMediaController,
);

router.post("/", verifyUser, requireRole("admin", "super admin"), createMediaController);

router.get("/", optionalSession, getMediaController);

router.post("/upload",verifyUser,requireRole("admin", "super admin"),uploadMediaFile.single("file"),uploadMediaController,);

router.get("/:id", optionalSession, getMediaByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateMediaController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteMediaController);

export default router;