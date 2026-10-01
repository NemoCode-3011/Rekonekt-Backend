import { requireRole } from "@middleware/authorize";
import { Router } from "express";
import {
  createMediaAttachmentController,
  getMediaAttachmentsController,
  getMediaAttachmentByIdController,
  updateMediaAttachmentController,
  deleteMediaAttachmentController,
} from "src/controller/mediaAttachment.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/",verifyUser,requireRole("admin", "super admin"),createMediaAttachmentController,);

router.get("/", getMediaAttachmentsController);

router.get("/:id", getMediaAttachmentByIdController);

router.patch( "/:id", verifyUser, requireRole("admin", "super admin"), updateMediaAttachmentController,);

router.delete("/:id",verifyUser,requireRole("admin", "super admin"),deleteMediaAttachmentController,);

export default router;
