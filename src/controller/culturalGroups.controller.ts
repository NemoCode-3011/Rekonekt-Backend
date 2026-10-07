import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import { getCulturalGroupsService } from "src/service/culturalGroups.service";

export const getCulturalGroupsController = async (req: Request,res: Response,) => {
  try {
    const groups = await getCulturalGroupsService();

    return sendResponse(
      res,
      200,
      "Cultural groups retrieved successfully",
      groups,
    );
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
