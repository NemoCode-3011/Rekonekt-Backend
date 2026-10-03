import { Request, Response } from "express";
import {
  createPlaceService,
  getPlaces,
  getPlaceById,
  updatePlaceService,
  deletePlace,
} from "../service/places.service";
import { sendResponse } from "../utils/response";
import {
  createPlaceSchema,
  updatePlaceSchema,
} from "../validation/place.schema";
export const createPlaceController = async (req: Request, res: Response) => {
  try {
    const validation = createPlaceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { name, description, latitude, longitude } = validation.data;

    const place = await createPlaceService(
      name,
      description ?? null,
      latitude,
      longitude,
    );

    return sendResponse(res, 201, "Place created successfully", place);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
export const getPlacesController = async (req: Request, res: Response) => {
  try {
    const places = await getPlaces();

    return sendResponse(res, 200, "Places retrieved successfully", places);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPlaceByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const place = await getPlaceById(id);

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

    return sendResponse(res, 200, "Place retrieved successfully", place);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updatePlaceController = async (req: Request, res: Response) => {
  try {
    const validation = updatePlaceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const place = await updatePlaceService(
      Number(req.params.id),
      validation.data as Parameters<typeof updatePlaceService>[1],
    );

    return sendResponse(res, 200, "Place updated successfully", place);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const deletePlaceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const place = await deletePlace(id);

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

    return sendResponse(res, 200, "Place deleted successfully", place);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
