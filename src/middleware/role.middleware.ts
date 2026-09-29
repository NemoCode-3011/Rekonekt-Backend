import { Request, Response, NextFunction } from "express";
import { pool } from "src/database/db";
import { getUserRoleQuery } from "src/model/auth.queries";
import { sendResponse } from "src/utils/response";

export const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return sendResponse(res, 401, "Authentication required");
    }

    const result = await pool.query(getUserRoleQuery, [req.userId]);

    if (result.rows.length === 0) {
      return sendResponse(res, 404, "User not found");
    }

    if (result.rows[0].role !== "super admin") {
      return sendResponse(res, 403, "Super admin access required");
    }

    next();
  } catch (error: any) {
    console.log(error.message || error);

    return sendResponse(res, 500, "Internal server error");
  }
};