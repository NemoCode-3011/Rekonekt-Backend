import { Router } from "express";
import {
  addEventPersonController,
  getPeopleByEventController,
  removeEventPersonController,
} from "../controller/eventPeople.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/events/:eventId/people",verifyUser,  requireSuperAdmin,addEventPersonController,);

router.get("/events/:eventId/people", getPeopleByEventController);

router.delete("/events/:eventId/people/:personId",verifyUser,requireSuperAdmin,removeEventPersonController,);

export default router;
