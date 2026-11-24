import { Router } from "express";
import { getCulturalGroupsController } from "../controller/culturalGroups.controller";

const router = Router();

// Public: the settings screen needs the list.
router.get("/", getCulturalGroupsController);

export default router;