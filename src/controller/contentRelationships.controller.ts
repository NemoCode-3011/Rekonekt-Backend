import type { Request, Response } from "express";
import { sendResponse } from "../utils/response";
import {
  createSectionPerson,
  createSectionPlace,
  deleteSectionPerson,
  deleteSectionPlace,
  getSectionPeople,
  getSectionPlaces,
  getSourcesForContent,
} from "../service/contentRelationships.service";
import {
  relationshipIdSchema,
  sectionPersonSchema,
  sectionPlaceSchema,
  sourceTargetTypeSchema,
} from "../validation/content-relationships.schema";

const parsePathId = (value: string | string[]) =>
  relationshipIdSchema.safeParse(typeof value === "string" ? value : undefined);

const handleRelationshipError = (res: Response, error: any) => {
  console.error(error.message || error);

  if (error.code === "23503") {
    return sendResponse(res, 404, "Referenced resource not found");
  }
  if (error.code === "23505") {
    return sendResponse(res, 409, "Relationship already exists");
  }
  if (error.code === "23514") {
    return sendResponse(res, 400, "Exactly one relationship target is required");
  }

  return sendResponse(res, 500, "Internal server error");
};

export const getSectionPeopleController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  try {
    const people = await getSectionPeople(sectionId.data);
    return sendResponse(res, 200, "Section people retrieved", people);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const getAdminSectionPeopleController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  try {
    const people = await getSectionPeople(sectionId.data, true);
    return sendResponse(res, 200, "Section people retrieved", people);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const createSectionPersonController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  const validation = sectionPersonSchema.safeParse(req.body);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  if (!validation.success) {
    return sendResponse(res, 400, validation.error.issues[0].message);
  }
  try {
    const link = await createSectionPerson(
      sectionId.data,
      validation.data.personId,
      validation.data.displayOrder,
    );
    return sendResponse(res, 201, "Person linked to section", link);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const deleteSectionPersonController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  const personId = parsePathId(req.params.personId);
  if (!sectionId.success || !personId.success) {
    return sendResponse(res, 400, "Invalid section or person ID");
  }
  try {
    const link = await deleteSectionPerson(sectionId.data, personId.data);
    if (!link) return sendResponse(res, 404, "Section-person link not found");
    return sendResponse(res, 200, "Person unlinked from section", link);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const getSectionPlacesController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  try {
    const places = await getSectionPlaces(sectionId.data);
    return sendResponse(res, 200, "Section places retrieved", places);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const getAdminSectionPlacesController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  try {
    const places = await getSectionPlaces(sectionId.data, true);
    return sendResponse(res, 200, "Section places retrieved", places);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const createSectionPlaceController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  const validation = sectionPlaceSchema.safeParse(req.body);
  if (!sectionId.success) return sendResponse(res, 400, "Invalid section ID");
  if (!validation.success) {
    return sendResponse(res, 400, validation.error.issues[0].message);
  }
  try {
    const link = await createSectionPlace(
      sectionId.data,
      validation.data.placeId,
      validation.data.displayOrder,
    );
    return sendResponse(res, 201, "Place linked to section", link);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const deleteSectionPlaceController = async (
  req: Request,
  res: Response,
) => {
  const sectionId = parsePathId(req.params.sectionId);
  const placeId = parsePathId(req.params.placeId);
  if (!sectionId.success || !placeId.success) {
    return sendResponse(res, 400, "Invalid section or place ID");
  }
  try {
    const link = await deleteSectionPlace(sectionId.data, placeId.data);
    if (!link) return sendResponse(res, 404, "Section-place link not found");
    return sendResponse(res, 200, "Place unlinked from section", link);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};

export const getSourcesForContentController = async (
  req: Request,
  res: Response,
) => {
  const targetType = sourceTargetTypeSchema.safeParse(req.params.targetType);
  const targetId = parsePathId(req.params.targetId);
  if (!targetType.success || !targetId.success) {
    return sendResponse(res, 400, "Invalid content type or ID");
  }
  try {
    const sources = await getSourcesForContent(
      targetType.data,
      targetId.data,
    );
    return sendResponse(res, 200, "Content sources retrieved", sources);
  } catch (error: any) {
    return handleRelationshipError(res, error);
  }
};
