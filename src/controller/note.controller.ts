import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createNote,
  getNotesByUser,
  getNoteById,
  updateNote,
  deleteNote,
} from "src/service/note.service";

export const createNoteController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { title, content, noteDate } = req.body;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    if (!content) {
      return sendResponse(res, 400, "Content is required");
    }

    const note = await createNote(
      userId,
      title || null,
      content,
      noteDate || null,
    );

    return sendResponse(res, 201, "Note created successfully", note);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to create note");
  }
};

export const getNotesController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const notes = await getNotesByUser(userId);

    return sendResponse(res, 200, "Notes retrieved successfully", notes);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve notes");
  }
};

export const getNoteByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const note = await getNoteById(id, userId);

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(res, 200, "Note retrieved successfully", note);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve note");
  }
};

export const updateNoteController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    const { title, content, noteDate } = req.body;

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    if (!content) {
      return sendResponse(res, 400, "Content is required");
    }

    const note = await updateNote(
      id,
      userId,
      title || null,
      content,
      noteDate || null,
    );

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(res, 200, "Note updated successfully", note);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to update note");
  }
};

export const deleteNoteController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);

    if (!userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const note = await deleteNote(id, userId);

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(res, 200, "Note deleted successfully", note);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to delete note");
  }
};
