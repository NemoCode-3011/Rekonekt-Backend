import { Request, Response } from "express";
import { searchPublishedContentService } from "../service/search.service";
import { sendResponse } from "../utils/response";

export const searchController = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.q ?? "").trim();

    if (query.length < 2) {
      return sendResponse(res, 400, "Search must be at least 2 characters");
    }

    const results = await searchPublishedContentService(query);

    return sendResponse(res, 200, "Search results retrieved", results);
  } catch (error: any) {
    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  }
};
