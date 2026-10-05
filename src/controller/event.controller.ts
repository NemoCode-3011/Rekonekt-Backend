import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createEventService,
  getEventsBySectionService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
  getPublishedEventsService,
} from "src/service/event.service";
import {
  createEventSchema,
  updateEventSchema,
} from "src/validation/event.schema";

export const createEventController = async (req: Request, res: Response) => {
  try {
    const validation = createEventSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      sectionId,
      title,
      slug,
      description,
      eventDate,
      dateDisplay,
      imageUrl,
    } = validation.data;

    const event = await createEventService({
      sectionId,
      title,
      slug,
      description,
      eventDate,
      dateDisplay,
      imageUrl,
    });

    return sendResponse(res, 201, "Event created successfully", event);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Event slug already exists");
    }

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
  try {
    const validation = updateEventSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const event = await updateEventService(
      Number(req.params.id),
      validation.data as Parameters<typeof updateEventService>[1],
    );

    return sendResponse(res, 200, "Event updated successfully", event);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Event slug already exists");
    }

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
export const getPublishedEventsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getPublishedEventsService();

    return sendResponse(res, 200, "Events retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
