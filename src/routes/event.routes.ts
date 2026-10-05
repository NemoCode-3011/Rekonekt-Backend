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
import { createAdminContentController } from "../controller/adminContent.controller";


const router = Router();

const admin = createAdminContentController("events", "Event");
// admin routes for managing events
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), admin.publish);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);

router.post("/", verifyUser, requireRole("admin", "super admin"), createEventController);
router.get("/sections/:sectionId", getEventsBySectionController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), admin.list);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), admin.getById);
router.get("/:id", getEventByIdController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updateEventController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deleteEventController);
export default router;
