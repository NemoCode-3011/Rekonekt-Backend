import { Request, Response } from "express";
import {
  addEventPlace,
  getPlacesByEvent,
  removeEventPlace,
} from "../service/eventPlaces.service";
import { sendResponse } from "../utils/response";
import { addEventPlaceSchema } from "../validation/event-place.schema";

export const addEventPlaceController = async (req: Request, res: Response) => {
  try {
    const validation = addEventPlaceSchema.safeParse({
      eventId: Number(req.params.eventId),
      placeId: Number(req.body.placeId),
    });

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { eventId, placeId } = validation.data;

    const result = await addEventPlace(eventId, placeId);

    return sendResponse(res, 201, "Place added to event successfully", result);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Place is already linked to this event");
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Event or place not found");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPlacesByEventController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);

    const places = await getPlacesByEvent(eventId);

    return sendResponse(
      res,
      200,
      "Event places retrieved successfully",
      places,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const removeEventPlaceController = async (
  req: Request,
  res: Response,
) => {
  try {
    const eventId = Number(req.params.eventId);
    const placeId = Number(req.params.placeId);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return sendResponse(res, 400, "Invalid event ID");
    }

    if (!Number.isInteger(placeId) || placeId <= 0) {
      return sendResponse(res, 400, "Invalid place ID");
    }

    const result = await removeEventPlace(eventId, placeId);

    if (!result) {
      return sendResponse(res, 404, "Event-place relationship not found");
    }

    return sendResponse(
      res,
      200,
      "Place removed from event successfully",
      result,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
