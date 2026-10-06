import type { Request, Response } from "express";
import { getExhibitionBySlugService } from "../service/exhibitions.service";
import { getSectionsByExhibitionService } from "../service/sections.service";
import { sendResponse } from "../utils/response";

export const getExperienceBySlugController = async (
  req: Request,
  res: Response,
) => {
  try {
    const exhibition = await getExhibitionBySlugService(
      String(req.params.slug),
    );
    const sections = await getSectionsByExhibitionService(exhibition.id);

    return sendResponse(res, 200, "Experience retrieved successfully", {
      ...exhibition,
      sections,
    });
  } catch (error: any) {
    if (error.message === "Exhibition not found") {
      return sendResponse(res, 404, error.message);
    }

    console.error(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
