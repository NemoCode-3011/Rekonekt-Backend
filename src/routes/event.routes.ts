import { requireRole } from "@middleware/authorize";
import { Router } from "express";

import {
  createEventController,
  getEventsBySectionController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "src/controller/event.controller";

import { verifyUser } from "src/middleware/auth.middleware";


const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createEventController);

router.get("/sections/:sectionId", getEventsBySectionController);

router.get("/:id", getEventByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateEventController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteEventController);

export default router;
