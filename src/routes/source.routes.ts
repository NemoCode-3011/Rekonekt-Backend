import { requireRole } from "@middleware/authorize";
import { Router } from "express";
import {
  createSourceController,
  getSourcesController,
  getSourceByIdController,
  updateSourceController,
  deleteSourceController,
} from "src/controller/source.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createSourceController);

router.get("/", verifyUser, requireRole("admin", "super admin"), getSourcesController);

router.get("/:id", verifyUser, requireRole("admin", "super admin"), getSourceByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateSourceController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteSourceController);

export default router;
