import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createEventService,
  getEventsBySectionService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} from "src/service/event.service";

export const createEventController = async (req: Request, res: Response) => {
  const {
    sectionId,
    title,
    slug,
    description,
    eventDate,
    dateDisplay,
    imageUrl,
  } = req.body;

  try {
    if (!sectionId) {
      return sendResponse(res, 400, "Section ID is required");
    }

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    const result = await createEventService({
      sectionId,
      title,
      slug,
      description,
      eventDate,
      dateDisplay,
      imageUrl,
    });

    return sendResponse(res, 201, "Event created successfully", result);
  } catch (error: any) {
    if (
      error.message === "Section not found" ||
      error.message === "Event slug already exists in this section"
    ) {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getEventsBySectionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const sectionId = Number(req.params.sectionId);

    if (Number.isNaN(sectionId)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const result = await getEventsBySectionService(sectionId);

    return sendResponse(res, 200, "Events retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid event ID");
    }

    const result = await getEventByIdService(id);

    return sendResponse(res, 200, "Event retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Event not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateEventController = async (req: Request, res: Response) => {
  const {
    sectionId,
    title,
    slug,
    description,
    eventDate,
    dateDisplay,
    imageUrl,
  } = req.body;

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid event ID");
    }

    if (!sectionId) {
      return sendResponse(res, 400, "Section ID is required");
    }

    if (!title || !slug) {
      return sendResponse(res, 400, "Title and slug are required");
    }

    const result = await updateEventService(id, {
      sectionId,
      title,
      slug,
      description,
      eventDate,
      dateDisplay,
      imageUrl,
    });

    return sendResponse(res, 200, "Event updated successfully", result);
  } catch (error: any) {
    if (
      error.message === "Event not found" ||
      error.message === "Section not found"
    ) {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Event slug already exists in this section") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid event ID");
    }

    const result = await deleteEventService(id);

    return sendResponse(res, 200, "Event deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Event not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
