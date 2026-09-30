import { Router } from "express";
import {
  createPlaceController,
  getPlacesController,
  getPlaceByIdController,
  updatePlaceController,
  deletePlaceController,
} from "../controller/places.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createPlaceController);

router.get("/", getPlacesController);

router.get("/:id", getPlaceByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updatePlaceController);

router.delete("/:id", verifyUser, requireSuperAdmin, deletePlaceController);

export default router;
