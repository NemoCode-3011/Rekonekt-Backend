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

router.post("/",verifyUser,requireSuperAdmin,createMediaAttachmentController,);

router.get("/", getMediaAttachmentsController);

router.get("/:id", getMediaAttachmentByIdController);

router.patch( "/:id", verifyUser, requireSuperAdmin, updateMediaAttachmentController,);

router.delete("/:id",verifyUser,requireSuperAdmin,deleteMediaAttachmentController,);

export default router;
