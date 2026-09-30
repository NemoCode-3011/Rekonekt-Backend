import { Router } from "express";
import {
  createBookmarkController,
  getBookmarksController,
  getBookmarkByIdController,
  deleteBookmarkController,
} from "../controller/bookmarks.controller";
import { verifyUser } from "src/middleware/auth.middleware";

const router = Router();

router.post("/", verifyUser, createBookmarkController);

router.get("/", verifyUser, getBookmarksController);

router.get("/:id", verifyUser, getBookmarkByIdController);

router.delete("/:id", verifyUser, deleteBookmarkController);

export default router;
