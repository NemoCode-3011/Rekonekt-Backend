import { Router } from "express";
import {
  addEventPersonController,
  getAdminPeopleByEventController,
  getPeopleByEventController,
  removeEventPersonController,
} from "../controller/eventPeople.controller";
import {
  optionalSession,
  verifyUser,
} from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.get(
  "/admin/events/:eventId/people",
  verifyUser,
  requireRole("admin", "super admin"),
  getAdminPeopleByEventController,
);

router.post("/events/:eventId/people",verifyUser,  requireRole("admin", "super admin"),addEventPersonController,);

router.get("/events/:eventId/people", optionalSession, getPeopleByEventController);

router.delete("/events/:eventId/people/:personId",verifyUser,requireRole("admin", "super admin"),removeEventPersonController,);

export default router;