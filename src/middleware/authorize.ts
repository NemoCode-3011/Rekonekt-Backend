import { Request, Response, NextFunction } from "express";
import { pool } from "../database/db";
import { getUserRoleQuery } from "src/model/auth.queries";
import { sendResponse } from "src/utils/response";

export const requireRole = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        return sendResponse(res, 401, "Authentication required");
      }

      const result = await pool.query(
        getUserRoleQuery,
        [req.userId]
      );

      const user = result.rows[0];

      if (!user) {
        return sendResponse(res, 401, "User not found");
      }

      if (!allowedRoles.includes(user.role)) {
        return sendResponse(res, 403, "Access denied");
      }

      next();
    } catch (error: any) {
      console.log(error.message || error);

      return sendResponse(
        res,
        500,
        "Internal server error"
      );
    }
  };
};