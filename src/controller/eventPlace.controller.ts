import { Request, Response } from "express";
import {
  addEventPlace,
  getPlacesByEvent,
  removeEventPlace,
} from "../service/eventPlaces.service";
import { sendResponse } from "../utils/response";

export const addEventPlaceController = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.eventId);
    const { placeId } = req.body;

    if (!placeId) {
      return sendResponse(res, 400, "Place ID is required");
    }

    const result = await addEventPlace(eventId, placeId);

    return sendResponse(res, 201, "Place linked to event successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPlacesByEventController = async (req: Request,res: Response,) => {
  try {
    const eventId = Number(req.params.eventId);

    const places = await getPlacesByEvent(eventId);

    return sendResponse(res, 200, "Event places retrieved successfully", places,);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const removeEventPlaceController = async (req: Request,res: Response,) => {
  try {
    const eventId = Number(req.params.eventId);
    const placeId = Number(req.params.placeId);

    const result = await removeEventPlace(eventId, placeId);

    if (!result) {
      return sendResponse(res, 404, "Event-place relationship not found");
    }

    return sendResponse(res,200,"Place removed from event successfully",result,);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
