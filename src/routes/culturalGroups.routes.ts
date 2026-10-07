import { Router } from "express";
import { getCulturalGroupsController } from "src/controller/culturalGroups.controller";

const router = Router();

// Public: the settings screen needs the list.
router.get("/", getCulturalGroupsController);

export default router;