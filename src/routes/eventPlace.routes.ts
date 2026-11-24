import { Router } from "express";
import {
  addEventPlaceController,
  getAdminPlacesByEventController,
  getPlacesByEventController,
  removeEventPlaceController,
} from "../controller/eventPlace.controller";
import {
  optionalSession,
  verifyUser,
} from "../middleware/auth.middleware";
import { requireRole } from "../middleware/authorize";

const router = Router();

router.get(
  "/admin/events/:eventId/places",
  verifyUser,
  requireRole("admin", "super admin"),
  getAdminPlacesByEventController,
);

router.post("/events/:eventId/places",verifyUser,requireRole("admin", "super admin"),addEventPlaceController,);

router.get("/events/:eventId/places", optionalSession, getPlacesByEventController);

router.delete("/events/:eventId/places/:placeId",verifyUser,requireRole("admin", "super admin"),removeEventPlaceController,);

export default router;