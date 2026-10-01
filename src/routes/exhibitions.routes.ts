import { Router } from "express";
import {
  getPublishedExhibitionsController,
  getExhibitionBySlugController,
  publishExhibitionController,
  updateExhibitionController,
} from "../controller/exhibitions.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { createExhibitionController } from "../controller/exhibitions.controller";
import { deleteExhibitionController } from "src/controller/auth.controller";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.get("/", getPublishedExhibitionsController);
router.get("/:slug", getExhibitionBySlugController);
router.post("/", verifyUser, requireRole("admin", "super admin"),createExhibitionController);
router.patch("/:id/publish",verifyUser,requireRole("admin", "super admin"), publishExhibitionController);
router.delete("/:id",verifyUser,requireRole("admin", "super admin"),deleteExhibitionController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateExhibitionController);

export default router;
