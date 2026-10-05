import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";

import {
  createPersonService,
  getPeopleService,
  getPersonByIdService,
  updatePersonService,
  deletePersonService,
  getPersonBySlugService,
} from "../service/people.service";
import {
  createPersonSchema,
  updatePersonSchema,
} from "src/validation/people.schema";

export const createPersonController = async (req: Request, res: Response) => {
  try {
    const validation = createPersonSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const { name, slug, description, birthDate, deathDate } = validation.data;

    const person = await createPersonService({
      name,
      slug,
      description,
      birthDate,
      deathDate,
    });

    return sendResponse(res, 201, "Person created successfully", person);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Person slug already exists");
    }

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
  try {
    const validation = updatePersonSchema.safeParse(req.body);

    if (!validation.success) {
      return sendResponse(res, 400, validation.error.issues[0].message);
    }

    const person = await updatePersonService(
      Number(req.params.id),
      validation.data as Parameters<typeof updatePersonService>[1],
    );

    return sendResponse(res, 200, "Person updated successfully", person);
  } catch (error: any) {
    console.log(error.message || error);

    if (error.code === "23505") {
      return sendResponse(res, 409, "Person slug already exists");
    }

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
export const getPersonBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getPersonBySlugService(String(req.params.slug));

    return sendResponse(res, 200, "Person retrieved successfully", result);
  } catch (error: any) {
    if (error.message === "Person not found") {
      return sendResponse(res, 404, error.message);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
