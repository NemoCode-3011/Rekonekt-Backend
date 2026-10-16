import { Router } from "express";
import { requireRole } from "@middleware/authorize";
import {
  optionalSession,
  verifyUser,
} from "src/middleware/auth.middleware";
import {
  createSectionPersonController,
  createSectionPlaceController,
  deleteSectionPersonController,
  deleteSectionPlaceController,
  getAdminSectionPeopleController,
  getAdminSectionPlacesController,
  getSectionPeopleController,
  getSectionPlacesController,
  getSourcesForContentController,
} from "../controller/contentRelationships.controller";

const router = Router();
const admin = [verifyUser, requireRole("admin", "super admin")];

router.get("/source-links/content/:targetType/:targetId", optionalSession, getSourcesForContentController);

router.get("/sections/:sectionId/people", optionalSession, getSectionPeopleController);
router.get("/admin/sections/:sectionId/people", ...admin, getAdminSectionPeopleController);
router.post("/sections/:sectionId/people", ...admin, createSectionPersonController);
router.delete("/sections/:sectionId/people/:personId", ...admin, deleteSectionPersonController);

router.get("/sections/:sectionId/places", optionalSession, getSectionPlacesController);
router.get("/admin/sections/:sectionId/places", ...admin, getAdminSectionPlacesController);
router.post("/sections/:sectionId/places", ...admin, createSectionPlaceController);
router.delete("/sections/:sectionId/places/:placeId", ...admin, deleteSectionPlaceController);

export default router;