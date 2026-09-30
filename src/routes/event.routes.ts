import { Router } from "express";

import {
  createEventController,
  getEventsBySectionController,
  getEventByIdController,
  updateEventController,
  deleteEventController,
} from "src/controller/event.controller";

import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createEventController);

router.get("/sections/:sectionId", getEventsBySectionController);

router.get("/:id", getEventByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updateEventController);

router.delete("/:id", verifyUser, requireSuperAdmin, deleteEventController);

export default router;
