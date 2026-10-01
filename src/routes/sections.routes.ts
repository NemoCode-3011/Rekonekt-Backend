import { Router } from "express";
import {
  createSectionController,
  getSectionsByExhibitionController,
  getSectionByIdController,
  updateSectionController,
  deleteSectionController,
} from "../controller/sections.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/",verifyUser,requireRole("admin", "super admin"),createSectionController);
router.get("/exhibitions/:exhibitionId",getSectionsByExhibitionController);
router.get("/:id", getSectionByIdController);
router.patch("/:id",verifyUser,requireRole("admin", "super admin"),updateSectionController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"),deleteSectionController);

export default router;