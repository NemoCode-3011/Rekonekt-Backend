import { Router } from "express";
import { searchController } from "../controller/search.controller";
import { requireExhibitionSignup } from "src/middleware/auth.middleware";

const router = Router();

router.get("/", requireExhibitionSignup, searchController);

export default router;
