import { Router } from "express";
import {
  createNoteController,
  getNotesController,
  getNoteByIdController,
  updateNoteController,
  deleteNoteController,
} from "src/controller/note.controller";
import { verifyUser } from "src/middleware/auth.middleware";

const router = Router();

router.post("/", verifyUser, createNoteController);

router.get("/", verifyUser, getNotesController);

router.get("/:id", verifyUser, getNoteByIdController);

router.patch("/:id", verifyUser, updateNoteController);

router.delete("/:id", verifyUser, deleteNoteController);

export default router;
