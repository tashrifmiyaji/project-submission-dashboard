import { env } from "../config/env.js";
import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication token is required");
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      throw new AppError(401, "Authentication token is required");
    }

    const secret = env.JWT_ACCESS_SECRET;

    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(token, secret);
    } catch {
      throw new AppError(401, "Invalid or expired authentication token");
    }

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.email !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new AppError(401, "Invalid authentication token payload");
    }

    const isUser = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!isUser) {
      throw new AppError(401, "Invalid or expired authentication token");
    }

    if (isUser.isActive === false) {
      throw new AppError(403, "Your account has been deactivated");
    }

    req.user = {
      userId: isUser.id,
      email: isUser.email,
      role: isUser.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
