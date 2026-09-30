import { Router } from "express";
import {
  createSourceLinkController,
  getSourceLinksController,
  getSourceLinkByIdController,
  updateSourceLinkController,
  deleteSourceLinkController,
} from "src/controller/sourceLink.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createSourceLinkController);

router.get("/", verifyUser, requireSuperAdmin, getSourceLinksController);

router.get("/:id", verifyUser, requireSuperAdmin, getSourceLinkByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateSourceLinkController);

router.delete(
  "/:id",
  verifyUser,
  requireSuperAdmin,
  deleteSourceLinkController,
);

export default router;
