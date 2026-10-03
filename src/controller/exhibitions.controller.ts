import { Request, Response } from "express";
import {
  getPublishedExhibitionsService,
  getExhibitionBySlugService,
  createExhibitionService,
  publishExhibitionService,
  updateExhibitionService,
  deleteExhibitionService,
} from "../service/exhibitions.service";
import { sendResponse } from "src/utils/response";
import { createExhibitionSchema, updateExhibitionSchema } from "src/validation/exhibition.schema";


export const getPublishedExhibitionsController = async (
  req: Request,
  res: Response,
) => {
  try {
    const results = await getPublishedExhibitionsService();

    return sendResponse(
      res,
      200,
      "Exhibitions retrieved successfully",
      results,
    );
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getExhibitionBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const slug = req.params.slug as string;

    const result = await getExhibitionBySlugService(slug);

    return sendResponse(res, 200, "Exhibition retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const createExhibitionController = async (req: Request, res: Response) => {
  try {
    const validation = createExhibitionSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      title,
      slug,
      subtitle,
      description,
      startDate,
      endDate,
      coverImageUrl,
    } = validation.data;

    const exhibition = await createExhibitionService({
      title,
      slug,
      subtitle,
      description,
      startDate,
      endDate,
      coverImageUrl,
    });

    return sendResponse(
      res,
      201,
      "Exhibition created successfully",
      exhibition,
    );
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Exhibition slug already exists");
    }

    return sendResponse(res, 500, "Internal server error");
  }
};

export const publishExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result = await publishExhibitionService(id);

    return sendResponse(res, 200, "Exhibition published successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const validation = updateExhibitionSchema.safeParse(req.body);

if (!validation.success) {
  return sendResponse(
    res,
    400,
    validation.error.issues[0].message
  );
}

const exhibition = await updateExhibitionService(
  Number(req.params.id),
  validation.data as Parameters<typeof updateExhibitionService>[1],
);

return sendResponse(
  res,
  200,
  "Exhibition updated successfully",
  exhibition
);

  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Exhibition slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
export const deleteExhibitionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid exhibition ID");
    }

    const result = await deleteExhibitionService(id);

    return sendResponse(res, 200, "Exhibition deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};
