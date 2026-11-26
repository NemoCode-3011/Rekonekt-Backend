import type { Request, Response } from "express";
import {
  createPlaceService,
  getPlaces,
  getPlaceFacets,
  getPlaceById,
  getPlaceBySlug,
  updatePlaceService,
  deletePlace,
} from "../service/places.service";
import { sendResponse } from "../utils/response";
import {
  PLACE_CATEGORIES,
  PLACE_REGIONS,
  createPlaceSchema,
  updatePlaceSchema,
} from "../validation/place.schema";

const fail = (res: Response, error: any) => {
  if (error.message === "Place slug already exists") {
    return sendResponse(res, 409, error.message);
  }

  if (error.message === "Place not found") {
    return sendResponse(res, 404, error.message);
  }

  console.log(error.message || error);
  return sendResponse(res, 500, "Internal server error");
};

const oneOf = <T extends string>(
  list: readonly T[],
  value: unknown,
): T | undefined | null =>
  // undefined: no filter was asked for. null: the value is not on the list.
  typeof value !== "string" || value === ""
    ? undefined
    : (list as readonly string[]).includes(value)
      ? (value as T)
      : null;

export const createPlaceController = async (req: Request, res: Response) => {
  try {
    const validation = createPlaceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const place = await createPlaceService(validation.data);

    return sendResponse(res, 201, "Place created successfully", place);
  } catch (error: any) {
    return fail(res, error);
  }
};

// GET /places?region=Osun&category=sacred-site&q=grove
export const getPlacesController = async (req: Request, res: Response) => {
  try {
    const region = oneOf(PLACE_REGIONS, req.query.region);
    const category = oneOf(PLACE_CATEGORIES, req.query.category);

    if (region === null) {
      return sendResponse(res, 400, "Unknown region");
    }

    if (category === null) {
      return sendResponse(res, 400, "Unknown category");
    }

    const search =
      typeof req.query.q === "string" ? req.query.q.slice(0, 100) : undefined;

    const places = await getPlaces({ region, category, search });

    return sendResponse(res, 200, "Places retrieved successfully", places);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getPlaceFacetsController = async (
  _req: Request,
  res: Response,
) => {
  try {
    const facets = await getPlaceFacets();

    return sendResponse(res, 200, "Place filters retrieved", facets);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getPlaceByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid place ID");
    }

    const place = await getPlaceById(id);

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

    return sendResponse(res, 200, "Place retrieved successfully", place);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getPlaceBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const place = await getPlaceBySlug(String(req.params.slug));

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

    return sendResponse(res, 200, "Place retrieved successfully", place);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const updatePlaceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid place ID");
    }

    const validation = updatePlaceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const place = await updatePlaceService(id, validation.data);

    return sendResponse(res, 200, "Place updated successfully", place);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const deletePlaceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid place ID");
    }

    const place = await deletePlace(id);

    if (!place) {
      return sendResponse(res, 404, "Place not found");
    }

    return sendResponse(res, 200, "Place deleted successfully", place);
  } catch (error: any) {
    return fail(res, error);
  }
};