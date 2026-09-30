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

const router = Router();

router.post("/", verifyUser, requireSuperAdmin, createPersonController);

router.get("/", getPeopleController);

router.get("/:id", getPersonByIdController);

router.patch("/:id", verifyUser, requireSuperAdmin, updatePersonController);

router.delete("/:id", verifyUser, requireSuperAdmin, deletePersonController);

export default router;
