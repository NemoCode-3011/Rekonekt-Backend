import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createSourceService,
  getSources,
  getSourceById,
  updateSourceService,
  deleteSource,
} from "src/service/source.service";
import {
  createSourceSchema,
  updateSourceSchema,
} from "src/validation/source.schema";

export const createSourceController = async (req: Request, res: Response) => {
  try {
    const validation = createSourceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      title,
      author,
      publication,
      sourceType,
      publicationDate,
      url,
      citation,
      rightsStatement,
      perspectiveNote,
    } = validation.data;

    const source = await createSourceService(
      title,
      author ?? null,
      publication ?? null,
      sourceType ?? null,
      publicationDate ?? null,
      url ?? null,
      citation ?? null,
      rightsStatement ?? null,
      perspectiveNote ?? null,
    );

    return sendResponse(res, 201, "Source created successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const getSourcesController = async (req: Request, res: Response) => {
  try {
    const sources = await getSources();

    return sendResponse(res, 200, "Sources retrieved successfully", sources);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve sources");
  }
};

export const getSourceByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const source = await getSourceById(id);

    if (!source) {
      return sendResponse(res, 404, "Source not found");
    }

    return sendResponse(res, 200, "Source retrieved successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to retrieve source");
  }
};

export const updateSourceController = async (req: Request, res: Response) => {
  try {
    const validation = updateSourceSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const source = await updateSourceService(
      Number(req.params.id),
      validation.data as Parameters<typeof updateSourceService>[1],
    );

    return sendResponse(res, 200, "Source updated successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteSourceController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const source = await deleteSource(id);

    if (!source) {
      return sendResponse(res, 404, "Source not found");
    }

    return sendResponse(res, 200, "Source deleted successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to delete source");
  }
};
