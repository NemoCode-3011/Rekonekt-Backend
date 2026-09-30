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

router.post("/", verifyUser, requireSuperAdmin, createSourceController);

router.get("/", verifyUser, requireSuperAdmin, getSourcesController);

router.get("/:id", verifyUser, requireSuperAdmin, getSourceByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateSourceController);

router.delete("/:id", verifyUser, requireSuperAdmin, deleteSourceController);

export default router;
