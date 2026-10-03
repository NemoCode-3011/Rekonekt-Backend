import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createNoteService,
  getNotesByUserService,
  getNoteByIdService,
  updateNoteService,
  deleteNoteService,
} from "src/service/note.service";
import { createNoteSchema, updateNoteSchema } from "../validation/notes.schema";

export const createNoteController = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const validation = createNoteSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { title, content, noteDate } = validation.data;

    const note = await createNoteService(
      req.userId,
      title,
      content,
      noteDate || null,
    );

    return sendResponse(res, 201, "Note created successfully", note);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getNotesController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const notes = await getNotesByUserService(req.userId);

    return sendResponse(
      res,
      200,
      "Notes retrieved successfully",
      notes
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getNoteByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendResponse(res, 400, "Invalid note ID");
    }

    const note = await getNoteByIdService(
      id,
      req.userId
    );

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(
      res,
      200,
      "Note retrieved successfully",
      note
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateNoteController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendResponse(res, 400, "Invalid note ID");
    }

    const validation = updateNoteSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(
        res,
        400,
        validation.error.issues[0].message
      );
    }

    const { title, content, noteDate } = validation.data;
    const safeTitle = title ?? null;
    const safeContent = content ?? "";
    const safeNoteDate = noteDate ?? null;

    const note = await updateNoteService(
      id,
      req.userId,
      safeTitle,
      safeContent,
      safeNoteDate
    );

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(
      res,
      200,
      "Note updated successfully",
      note
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteNoteController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return sendResponse(res, 400, "Invalid note ID");
    }

    const note = await deleteNoteService(
      id,
      req.userId
    );

    if (!note) {
      return sendResponse(res, 404, "Note not found");
    }

    return sendResponse(
      res,
      200,
      "Note deleted successfully",
      note
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};