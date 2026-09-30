import { Router } from "express";
import { googleAuthController } from "src/controller/googleAuth.controller";

const router = Router();

router.post("/", googleAuthController);

export default router;