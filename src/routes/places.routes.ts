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
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createPlaceController);

router.get("/", getPlacesController);

router.get("/:id", getPlaceByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updatePlaceController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deletePlaceController);

export default router;
