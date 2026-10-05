import { Router } from "express";
import { searchController } from "../controller/search.controller";

const router = Router();

router.get("/", searchController);

export default router;
