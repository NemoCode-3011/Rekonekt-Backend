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

const router = Router();

router.post("/",verifyUser,requireSuperAdmin,createSectionController);
router.get("/exhibitions/:exhibitionId",getSectionsByExhibitionController);
router.get("/:id", getSectionByIdController);
router.patch("/:id",verifyUser,requireSuperAdmin,updateSectionController);
router.delete("/:id", verifyUser, requireSuperAdmin,deleteSectionController);

export default router;