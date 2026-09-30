import { Request, Response } from "express";
import {
  addEventPerson,
  getPeopleByEvent,
  removeEventPerson,
} from "../service/eventPeople.service";
import { sendResponse } from "../utils/response";

export const addEventPersonController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);
    const { personId } = req.body;

    if (!personId) {
      return sendResponse(res, 400, "Person ID is required");
    }

    const result = await addEventPerson(eventId, personId);

    return sendResponse(
      res,
      201,
      "Person linked to event successfully",
      result,
    );
  } catch (error: any) {
    console.log(error.message || error);
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

export const removeEventPersonController = async (req: Request,res: Response,) => {
  try {
    const eventId = Number(req.params.eventId);
    const personId = Number(req.params.personId);

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
