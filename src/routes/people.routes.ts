import { Router } from "express";

import {
  createPersonController,
  getPeopleController,
  getPersonByIdController,
  updatePersonController,
  deletePersonController,
} from "../controller/people.controller";

import { verifyUser } from "src/middleware/auth.middleware";
import { requireSuperAdmin } from "src/middleware/role.middleware";
import { requireRole } from "@middleware/authorize";

const router = Router();

router.post("/", verifyUser, requireRole("admin", "super admin"), createPersonController);

router.get("/", getPeopleController);

router.get("/:id", getPersonByIdController);

router.patch("/:id", verifyUser, requireRole("admin", "super admin"), updatePersonController);

router.delete("/:id", verifyUser, requireRole("admin", "super admin"), deletePersonController);

export default router;
