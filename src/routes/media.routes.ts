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
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { uploadMediaFile } from "@middleware/upload.middleware";

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createMediaController);

router.get("/", getMediaController);

router.post("/upload",verifyUser,requireSuperAdmin,uploadMediaFile.single("file"),uploadMediaController,);

router.get("/:id", getMediaByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateMediaController);

router.delete("/:id", verifyUser, requireSuperAdmin, deleteMediaController);

export default router;
