import { Router } from "express";
import { getExperienceBySlugController } from "../controller/experience.controller";
import { optionalSession } from "src/middleware/auth.middleware";

const router = Router();

router.get("/:slug", optionalSession, getExperienceBySlugController);

export default router;