import { Router } from "express";
import {
  addEventPersonController,
  getPeopleByEventController,
  removeEventPersonController,
} from "../controller/eventPeople.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/events/:eventId/people",verifyUser,  requireRole("admin", "super admin"),addEventPersonController,);

router.get("/events/:eventId/people", getPeopleByEventController);

router.delete("/events/:eventId/people/:personId",verifyUser,requireRole("admin", "super admin"),removeEventPersonController,);

export default router;
