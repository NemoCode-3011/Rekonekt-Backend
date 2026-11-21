import type { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  code?: string,
) => {
  const body = code ? { code, message, data } : { message, data };
  return res.status(statusCode).json(body);
};
