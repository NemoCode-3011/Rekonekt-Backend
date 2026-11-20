import { Router } from "express";
import { googleAuthController } from "src/controller/googleAuth.controller";
import { googleAuthLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/", googleAuthLimiter, googleAuthController);

export default router;