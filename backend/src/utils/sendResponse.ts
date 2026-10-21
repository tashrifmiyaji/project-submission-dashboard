import type { Response } from "express";

interface SendResponseOptions<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
  }
}

export const sendResponse = <T>(res: Response, options: SendResponseOptions<T>,) => {
  const { statusCode, success, message, data, meta } = options;

  return res.status(statusCode).json({
    success,
    message,
    ...(data !== undefined && { data }),
    meta,
  });
};
