import { Request, Response } from "express";
import { sendResponse } from "src/utils/response";
import {
  ContentTable,
  listAllService,
  getAnyByIdService,
  publishService,
  unpublishService,
} from "../service/adminContent.service";

// Admin handlers for any table with a draft/published status.
export const createAdminContentController = (table: ContentTable, label: string) => {
  const fail = (res: Response, error: any) => {
    if (error.message === "Not found") {
      return sendResponse(res, 404, `${label} not found`);
    }

    console.log(error.message || error);
    return sendResponse(res, 500, "Internal server error");
  };

  const readId = (req: Request) => Number(req.params.id);

  return {
    list: async (req: Request, res: Response) => {
      try {
        const raw = req.query.sectionId;
        const sectionId = raw === undefined ? undefined : Number(raw);

        if (sectionId !== undefined && Number.isNaN(sectionId)) {
          return sendResponse(res, 400, "Invalid section ID");
        }

        const result = await listAllService(table, sectionId);

        return sendResponse(res, 200, `${label} list retrieved successfully`, result);
      } catch (error: any) {
        return fail(res, error);
      }
    },

    getById: async (req: Request, res: Response) => {
      try {
        const id = readId(req);

        if (Number.isNaN(id)) {
          return sendResponse(res, 400, `Invalid ${label.toLowerCase()} ID`);
        }

        const result = await getAnyByIdService(table, id);

        return sendResponse(res, 200, `${label} retrieved successfully`, result);
      } catch (error: any) {
        return fail(res, error);
      }
    },

    publish: async (req: Request, res: Response) => {
      try {
        const id = readId(req);

        if (Number.isNaN(id)) {
          return sendResponse(res, 400, `Invalid ${label.toLowerCase()} ID`);
        }

        const result = await publishService(table, id);

        return sendResponse(res, 200, `${label} published successfully`, result);
      } catch (error: any) {
        return fail(res, error);
      }
    },

    unpublish: async (req: Request, res: Response) => {
      try {
        const id = readId(req);

        if (Number.isNaN(id)) {
          return sendResponse(res, 400, `Invalid ${label.toLowerCase()} ID`);
        }

        const result = await unpublishService(table, id);

        return sendResponse(res, 200, `${label} unpublished successfully`, result);
      } catch (error: any) {
        return fail(res, error);
      }
    },
  };
};