import { Router } from "express";
import { getExperienceBySlugController } from "../controller/experience.controller";

const router = Router();

router.get("/:slug", getExperienceBySlugController);

export default router;
