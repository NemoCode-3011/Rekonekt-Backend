import { Router } from "express";
import {
  createProgressController,
  getProgressController,
  getProgressByExhibitionController,
  updateProgressController,
  deleteProgressController,
} from "src/controller/progress.controller";
import { verifyUser } from "src/middleware/auth.middleware";

const router = Router();

router.post("/", verifyUser, createProgressController);

router.get("/", verifyUser, getProgressController);

router.get("/:exhibitionId", verifyUser, getProgressByExhibitionController);

router.patch("/:exhibitionId", verifyUser, updateProgressController);

router.delete("/:exhibitionId", verifyUser, deleteProgressController);

export default router;
