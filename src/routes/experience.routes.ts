import { Router } from "express";
import { getExperienceBySlugController } from "../controller/experience.controller";
import { requireExhibitionSignup } from "src/middleware/auth.middleware";

const router = Router();

router.get("/:slug", requireExhibitionSignup, getExperienceBySlugController);

export default router;
