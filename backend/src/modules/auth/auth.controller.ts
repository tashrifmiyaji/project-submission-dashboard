
import type { Request, Response } from "express";
import { signup, login, getMe, changePassword } from "./auth.service.js";
import {
  signupSchema,
  loginSchema,
  changePasswordSchema,
} from "./auth.validation.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { AppError } from "../../utils/AppError.js";

export const signupController = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid request data");
  }

  const result = await signup(parsed.data);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created successfully",
    data: result,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid request data");
  }

  const result = await login(parsed.data);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
};

export const getMeController = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    throw new AppError(401, "Authentication required");
  }

  const result = await getMe(req.user.userId);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
};

export const changePasswordController = async (
  req: Request,
  res: Response,
) => {
  if (!req.user?.userId) {
    throw new AppError(401, "Authentication required");
  }

  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(400, parsed.error.issues[0]?.message ?? "Invalid request data");
  }

  const result = await changePassword(req.user.userId, parsed.data);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
  });
};
