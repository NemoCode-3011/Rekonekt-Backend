import { Router } from "express";
import {
  addEventPlaceController,
  getPlacesByEventController,
  removeEventPlaceController,
} from "../controller/eventPlace.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/events/:eventId/places",verifyUser,requireSuperAdmin,addEventPlaceController,);

router.get("/events/:eventId/places", getPlacesByEventController);

router.delete("/events/:eventId/places/:placeId",verifyUser,requireSuperAdmin,removeEventPlaceController,);

export default router;
