
import type { Request, Response } from "express";

import {
  createMentor,
  getMentors,
  updateMentorStatus,
} from "./users.service.js";

import {
  createMentorSchema,
  getMentorsQuerySchema,
  updateMentorStatusSchema,
} from "./users.validation.js";

import { AppError } from "../../utils/AppError.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createMentorController = async (
  req: Request,
  res: Response,
) => {
  const parsed = createMentorSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues[0]?.message ?? "Invalid request data",
    );
  }

  const result = await createMentor(parsed.data);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Mentor created successfully",
    data: result,
  });
};

export const getMentorsController = async (
  req: Request,
  res: Response,
) => {
  const parsed = getMentorsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues[0]?.message ?? "Invalid query parameters",
    );
  }

  const result = await getMentors(parsed.data);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentors retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
};

export const updateMentorStatusController = async (
  req: Request,
  res: Response,
) => {
  const mentorId = req.params.mentorId;

  if (typeof mentorId !== "string" || !mentorId.trim()) {
    throw new AppError(400, "Valid mentor ID is required");
  }

  const parsed = updateMentorStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      400,
      parsed.error.issues[0]?.message ?? "Invalid request data",
    );
  }

  const result = await updateMentorStatus(mentorId, parsed.data);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Mentor status updated successfully",
    data: result,
  });
};
