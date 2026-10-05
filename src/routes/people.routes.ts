import { Router } from "express";
import {
  createPersonController,
  getPeopleController,
  getPersonByIdController,
  updatePersonController,
  deletePersonController,
} from "../controller/people.controller";
import { verifyUser } from "src/middleware/auth.middleware";
import { requireRole } from "@middleware/authorize";
import { createAdminContentController } from "src/controller/adminContent.controller";

const router = Router();

const admin = createAdminContentController("people", "Person");
// admin routes for managing people
router.patch("/:id/publish", verifyUser, requireRole("admin", "super admin"), admin.publish);
router.patch("/:id/unpublish", verifyUser, requireRole("admin", "super admin"), admin.unpublish);


router.post("/", verifyUser, requireRole("admin", "super admin"), createPersonController);
router.get("/", getPeopleController);
router.get("/admin", verifyUser, requireRole("admin", "super admin"), admin.list);
router.get("/admin/:id", verifyUser, requireRole("admin", "super admin"), admin.getById);
router.get("/:id", getPersonByIdController);
router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updatePersonController);
router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deletePersonController);

export default router;
