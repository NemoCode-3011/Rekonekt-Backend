import { Router } from "express";
import {
  createSourceController,
  deleteSourceController,
  getSourceByIdController,
  getSourcesController,
  updateSourceController,
} from "../controller/source.controller";
import { requireRole } from "../middleware/authorize";
import { optionalSession, verifyUser } from "../middleware/auth.middleware";

const router = Router();

router.get("/", optionalSession, getSourcesController);
router.get("/:id", optionalSession, getSourceByIdController);
router.post("/", verifyUser, requireRole("admin", "super admin"), createSourceController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateSourceController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteSourceController);

export default router;
