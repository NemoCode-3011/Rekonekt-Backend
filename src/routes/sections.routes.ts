import { Router } from "express";
import {
  createSectionController,
  getSectionsByExhibitionController,
  getSectionByIdController,
  updateSectionController,
  deleteSectionController,
  getAdminSectionsByExhibitionController,
} from "../controller/sections.controller";
import {
  requireExhibitionSignup,
  verifyUser,
} from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();
router.get( "/admin/exhibitions/:exhibitionId", verifyUser, requireRole("admin", "super admin"), getAdminSectionsByExhibitionController,);
router.post("/",verifyUser,requireRole("admin", "super admin"),createSectionController);
router.get("/exhibitions/:exhibitionId", requireExhibitionSignup, getSectionsByExhibitionController);
router.get("/:id", requireExhibitionSignup, getSectionByIdController);
router.patch("/:id",verifyUser,requireRole("admin", "super admin"),updateSectionController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"),deleteSectionController);

export default router;