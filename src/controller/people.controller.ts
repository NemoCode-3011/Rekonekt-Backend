import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createPersonService,
  getPeopleService,
  getPersonByIdService,
  updatePersonService,
  deletePersonService,
} from "../service/people.service";

export const createPersonController = async (req: Request, res: Response) => {
  const { name, slug, description, birthDate, deathDate } = req.body;

  try {
    if (!name) {
      return sendResponse(res, 400, "Name is required");
    }

    if (!slug) {
      return sendResponse(res, 400, "Slug is required");
    }

    const result = await createPersonService({
      name,
      slug,
      description,
      birthDate,
      deathDate,
    });

    return sendResponse(res, 201, "Person created successfully", result);
  } catch (error: any) {
    if (error.message === "Person slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPeopleController = async (req: Request, res: Response) => {
  try {
    const result = await getPeopleService();

    return sendResponse(res, 200, "People retrieved successfully", result);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const getPersonByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid person ID");
    }

    const result = await getPersonByIdService(id);

    return sendResponse(res, 200, "Person retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Person not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const updatePersonController = async (req: Request, res: Response) => {
  const { name, slug, description, birthDate, deathDate } = req.body;

  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid person ID");
    }

    if (!name || !slug) {
      return sendResponse(res, 400, "Name and slug are required");
    }

    const result = await updatePersonService(id, {
      name,
      slug,
      description,
      birthDate,
      deathDate,
    });

    return sendResponse(res, 200, "Person updated successfully", result);
  } catch (error: any) {
    if (error.message === "Person not found") {
      return sendResponse(res, 404, error.message);
    }

    if (error.message === "Person slug already exists") {
      return sendResponse(res, 409, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};

export const deletePersonController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return sendResponse(res, 400, "Invalid person ID");
    }

    const result = await deletePersonService(id);

    return sendResponse(res, 200, "Person deleted successfully", result);
  } catch (error: any) {
    if (error.message === "Person not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
