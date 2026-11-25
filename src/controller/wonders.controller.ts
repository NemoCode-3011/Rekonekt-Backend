import type { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import {
  createWonderService,
  updateWonderService,
  deleteWonderService,
  getPublishedWondersService,
  getWonderBySlugService,
  getAdminWonderByIdService,
} from "../service/wonders.service";
import {
  WONDER_TYPES,
  createWonderSchema,
  updateWonderSchema,
} from "../validation/wonder.schema";

const readId = (req: Request) => Number(req.params.id);

const fail = (res: Response, error: any) => {
  if (error.message === "Wonder slug already exists") {
    return sendResponse(res, 409, error.message);
  }

  if (error.message === "Wonder not found") {
    return sendResponse(res, 404, error.message);
  }

  console.log(error.message || error);
  return sendResponse(res, 500, "Internal server error");
};

export const createWonderController = async (req: Request, res: Response) => {
  try {
    const validation = createWonderSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const wonder = await createWonderService(validation.data);

    return sendResponse(res, 201, "Wonder created successfully", wonder);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const updateWonderController = async (req: Request, res: Response) => {
  try {
    const id = readId(req);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid wonder ID");
    }

    const validation = updateWonderSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const wonder = await updateWonderService(id, validation.data);

    return sendResponse(res, 200, "Wonder updated successfully", wonder);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const deleteWonderController = async (req: Request, res: Response) => {
  try {
    const id = readId(req);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid wonder ID");
    }

    const deleted = await deleteWonderService(id);

    return sendResponse(res, 200, "Wonder deleted successfully", deleted);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getPublishedWondersController = async (
  req: Request,
  res: Response,
) => {
  try {
    const type = typeof req.query.type === "string" ? req.query.type : undefined;

    if (type !== undefined && !(WONDER_TYPES as readonly string[]).includes(type)) {
      return sendResponse(res, 400, "Unknown wonder type");
    }

    const wonders = await getPublishedWondersService(type);

    return sendResponse(res, 200, "Wonders retrieved successfully", wonders);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getWonderBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const wonder = await getWonderBySlugService(String(req.params.slug));

    if (!wonder) {
      return sendResponse(res, 404, "Wonder not found");
    }

    return sendResponse(res, 200, "Wonder retrieved successfully", wonder);
  } catch (error: any) {
    return fail(res, error);
  }
};

export const getAdminWonderByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = readId(req);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid wonder ID");
    }

    const wonder = await getAdminWonderByIdService(id);

    return sendResponse(res, 200, "Wonder retrieved successfully", wonder);
  } catch (error: any) {
    return fail(res, error);
  }
};