import { Request, Response } from "express";
import {
  createArtifact,
  getArtifacts,
  getArtifactsBySection,
  getArtifactById,
  updateArtifact,
  deleteArtifact,
} from "../service/artifacts.service";
import { sendResponse } from "../utils/response";

export const createArtifactController = async (req: Request, res: Response) => {
  try {
    const {
      sectionId,
      title,
      slug,
      artifactType,
      description,
      historicalContext,
      dateDisplay,
      placeId,
    } = req.body;

    if (!sectionId || !title || !slug) {
      return sendResponse(res, 400, "Section ID, title and slug are required");
    }

    const artifact = await createArtifact(
      sectionId,
      title,
      slug,
      artifactType || null,
      description || null,
      historicalContext || null,
      dateDisplay || null,
      placeId || null,
    );

    return sendResponse(res, 201, "Artifact created successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getArtifactsController = async (req: Request, res: Response) => {
  try {
    const artifacts = await getArtifacts();

    return sendResponse(
      res,
      200,
      "Artifacts retrieved successfully",
      artifacts,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getArtifactsBySectionController = async (
  req: Request,
  res: Response,
) => {
  try {
    const sectionId = Number(req.params.sectionId);

    if (isNaN(sectionId)) {
      return sendResponse(res, 400, "Invalid section ID");
    }

    const artifacts = await getArtifactsBySection(sectionId);

    return sendResponse(
      res,
      200,
      "Artifacts retrieved successfully",
      artifacts,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getArtifactByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid artifact ID");
    }

    const artifact = await getArtifactById(id);

    if (!artifact) {
      return sendResponse(res, 404, "Artifact not found");
    }

    return sendResponse(res, 200, "Artifact retrieved successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updateArtifactController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid artifact ID");
    }

    const {
      sectionId,
      title,
      slug,
      artifactType,
      description,
      historicalContext,
      dateDisplay,
      placeId,
    } = req.body;

    if (!sectionId || !title || !slug) {
      return sendResponse(res, 400, "Section ID, title and slug are required");
    }

    const artifact = await updateArtifact(
      id,
      sectionId,
      title,
      slug,
      artifactType || null,
      description || null,
      historicalContext || null,
      dateDisplay || null,
      placeId || null,
    );

    if (!artifact) {
      return sendResponse(res, 404, "Artifact not found");
    }

    return sendResponse(res, 200, "Artifact updated successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deleteArtifactController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return sendResponse(res, 400, "Invalid artifact ID");
    }

    const artifact = await deleteArtifact(id);

    if (!artifact) {
      return sendResponse(res, 404, "Artifact not found");
    }

    return sendResponse(res, 200, "Artifact deleted successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
