import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  createSource,
  getSources,
  getSourceById,
  updateSource,
  deleteSource,
} from "src/service/source.service";

export const createSourceController = async (req: Request, res: Response) => {
  try {
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
    } = req.body;

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    const source = await createSource(
      title,
      author || null,
      publication || null,
      sourceType || null,
      publicationDate || null,
      url || null,
      citation || null,
      rightsStatement || null,
      perspectiveNote || null,
    );

    return sendResponse(res, 201, "Source created successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to create source");
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
    const id = Number(req.params.id);

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
    } = req.body;

    if (!title) {
      return sendResponse(res, 400, "Title is required");
    }

    const source = await updateSource(
      id,
      title,
      author || null,
      publication || null,
      sourceType || null,
      publicationDate || null,
      url || null,
      citation || null,
      rightsStatement || null,
      perspectiveNote || null,
    );

    if (!source) {
      return sendResponse(res, 404, "Source not found");
    }

    return sendResponse(res, 200, "Source updated successfully", source);
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Failed to update source");
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
