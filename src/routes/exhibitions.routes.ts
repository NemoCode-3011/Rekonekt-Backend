import { Router } from "express";
import {
  getPublishedExhibitionsController,
  getExhibitionBySlugController,
  publishExhibitionController,
  updateExhibitionController,
} from "../controller/exhibitions.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { createExhibitionController } from "../controller/exhibitions.controller";
import { deleteExhibitionController } from "src/controller/auth.controller";

const router = Router();

router.get("/", getPublishedExhibitionsController);
router.get("/:slug", getExhibitionBySlugController);
router.post("/", verifyUser, requireSuperAdmin, createExhibitionController);
router.patch("/:id/publish",verifyUser,requireSuperAdmin,publishExhibitionController);
router.delete("/:id",verifyUser,requireSuperAdmin,deleteExhibitionController);
router.patch("/:id", verifyUser, requireSuperAdmin, updateExhibitionController);

export default router;
