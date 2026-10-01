import { Router } from "express";
import {
  createMediaController,
  getMediaController,
  getMediaByIdController,
  updateMediaController,
  deleteMediaController,
  uploadMediaController,
} from "src/controller/media.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { uploadMediaFile } from "@middleware/upload.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createMediaController);

router.get("/", getMediaController);

router.post("/upload",verifyUser,requireRole("admin", "super admin"),uploadMediaFile.single("file"),uploadMediaController,);

router.get("/:id", getMediaByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateMediaController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteMediaController);

export default router;
