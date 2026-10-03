import { Request, Response } from "express";
import {
  addEventPersonService,
  getPeopleByEvent,
  removeEventPerson,
} from "../service/eventPeople.service";
import { sendResponse } from "../utils/response";
import { addEventPersonSchema } from "src/validation/event-person.schema";

export const addEventPersonController = async (req: Request, res: Response) => {
  try {
    const validation = addEventPersonSchema.safeParse({
      eventId: Number(req.params.eventId),
      personId: Number(req.body.personId),
    });

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { eventId, personId } = validation.data;

    const result = await addEventPersonService(eventId, personId);

    return sendResponse(res, 201, "Person added to event successfully", result);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Person is already linked to this event");
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Event or person not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPeopleByEventController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);

    const people = await getPeopleByEvent(eventId);

    return sendResponse(
      res,
      200,
      "Event people retrieved successfully",
      people,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const removeEventPersonController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);
    const personId = Number(req.params.personId);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendResponse(res, 400, "Invalid event ID");
    }

    if (!Number.isInteger(personId) || personId <= 0) {
      return sendResponse(res, 400, "Invalid person ID");
    }

    const result = await removeEventPerson(eventId, personId);

    if (!result) {
      return sendResponse(res, 404, "Event-person relationship not found");
    }

    return sendResponse(
      res,
      200,
      "Person removed from event successfully",
      result,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
