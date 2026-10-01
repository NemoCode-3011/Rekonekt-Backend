import { Router } from "express";
import {
  addEventPlaceController,
  getPlacesByEventController,
  removeEventPlaceController,
} from "../controller/eventPlace.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/events/:eventId/places",verifyUser,requireRole("admin", "super admin"),addEventPlaceController,);

router.get("/events/:eventId/places", getPlacesByEventController);

router.delete("/events/:eventId/places/:placeId",verifyUser,requireRole("admin", "super admin"),removeEventPlaceController,);

export default router;
