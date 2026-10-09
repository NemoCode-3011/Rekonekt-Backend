import { Router } from "express";
import {
  createPlaceController,
  getPlacesController,
  getPlaceByIdController,
  updatePlaceController,
  deletePlaceController,
} from "../controller/places.controller";
import {
  requireExhibitionSignup,
  verifyUser,
} from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { requireRole } from "@middleware/authorize";
import { createAdminContentController } from "src/controller/adminContent.controller";

const router = Router();

const admin = createAdminContentController("places", "Place");
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), admin.publish);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);

router.post("/", verifyUser, requireRole("admin", "super admin"), createPlaceController);
router.get("/", requireExhibitionSignup, getPlacesController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), admin.list);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), admin.getById);
router.get("/:id", requireExhibitionSignup, getPlaceByIdController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updatePlaceController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deletePlaceController);

export default router;
