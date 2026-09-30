import { Request, Response } from "express";
import {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
} from "../service/places.service";
import { sendResponse } from "../utils/response";

export const createPlaceController = async (req: Request, res: Response) => {
  try {
    const { name, description, latitude, longitude } = req.body;

    if (!name) {
      return sendResponse(res, 400, "Name is required");
    }

    const place = await createPlace(
      name,
      description ?? null,
      latitude ?? null,
      longitude ?? null,
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
    const id = Number(req.params.id);
    const { name, description, latitude, longitude } = req.body;

    if (!name) {
      return sendResponse(res, 400, "Name is required");
    }

    const place = await updatePlace(
      id,
      name,
      description ?? null,
      latitude ?? null,
      longitude ?? null,
    );

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

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
