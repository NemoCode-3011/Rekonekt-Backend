import { Router } from "express";
import { searchController } from "../controller/search.controller";
import { optionalSession } from "../middleware/auth.middleware";

const router = Router();

router.get("/", optionalSession, searchController);

export default router;