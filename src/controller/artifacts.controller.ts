import { Request, Response } from "express";
import {
  createArtifactService,
  getArtifacts,
  getArtifactsBySection,
  getArtifactById,
  updateArtifact,
  deleteArtifact,
} from "../service/artifacts.service";
import { sendResponse } from "../utils/response";
import {
  createArtifactSchema,
  updateArtifactSchema,
} from "../validation/artifact.schema";

export const createArtifactController = async (req: Request, res: Response) => {
  try {
    const validation = createArtifactSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const {
      sectionId,
      title,
      slug,
      artifactType,
      description = null,
      historicalContext = null,
      dateDisplay = null,
      placeId = null,
    } = validation.data;

    const artifact = await createArtifactService({
      sectionId,
      title,
      slug,
      artifactType,
      description,
      historicalContext,
      dateDisplay,
      placeId,
    });

    return sendResponse(res, 201, "Artifact created successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Artifact slug already exists");
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Section or place not found");
    }

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
    const validation = updateArtifactSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const artifact = await updateArtifact(
      Number(req.params.id),
      validation.data as Parameters<typeof updateArtifact>[1],
    );

    return sendResponse(res, 200, "Artifact updated successfully", artifact);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Artifact slug already exists");
    }

    if (error.code === "23503") {
      return sendResponse(res, 404, "Section or place not found");
    }

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
