import type { Response } from "express";
export const sendResponse = (res:Response, statusCode:number, message: string, data:unknown = null) => {
  return res.status(statusCode).json({
    message: message,
    data: data,
  });
};
