import { Router } from "express";
import {
  createPlaceController,
  getPlacesController,
  getPlaceFacetsController,
  getPlaceBundlesController,
  getPlaceByIdController,
  getPlaceBySlugController,
  updatePlaceController,
  deletePlaceController,
} from "../controller/places.controller";
import { optionalSession, verifyUser } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/authorize";
import { createAdminContentController } from "../controller/adminContent.controller";

const router = Router();

// List, publish and unpublish work the same for every kind of content.
const admin = createAdminContentController("places", "Place");
const adminOnly = [verifyUser, requireRole("admin", "super admin")];

router.patch("/:id/publish", ...adminOnly, admin.publish);
router.patch("/:id/unpublish", ...adminOnly, admin.unpublish);

router.post("/", ...adminOnly, createPlaceController);
router.get("/", optionalSession, getPlacesController);

// These fixed words must stay above "/:id".
router.get("/facets", optionalSession, getPlaceFacetsController);
router.get("/bundles", optionalSession, getPlaceBundlesController);
router.get("/admin", ...adminOnly, admin.list);
router.get("/admin/:id", ...adminOnly, admin.getById);
router.get("/slug/:slug", optionalSession, getPlaceBySlugController);

router.get("/:id", optionalSession, getPlaceByIdController);
router.patch("/:id", ...adminOnly, updatePlaceController);
router.delete("/:id", ...adminOnly, deletePlaceController);

export default router;