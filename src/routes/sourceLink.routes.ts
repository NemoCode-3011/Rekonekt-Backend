import { requireRole } from "@middleware/authorize";
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

router.post("/", verifyUser, requireRole("admin", "super admin"), createSourceLinkController);

router.get("/", verifyUser, requireRole("admin", "super admin"), getSourceLinksController);

router.get("/:id", verifyUser, requireRole("admin", "super admin"), getSourceLinkByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateSourceLinkController);

router.delete("/:id",verifyUser, requireRole("admin", "super admin"), deleteSourceLinkController,);

export default router;
