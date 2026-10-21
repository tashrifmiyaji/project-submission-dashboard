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

    const isUser = prisma.user.findUnique({
      where: { id: decoded.sub }
    })

    if (!isUser) {
      throw new AppError(404, "user not found!");
    }

    req.user = {
      userId: decoded.sub,
      email: decoded.email,
      role: decoded.role as import("../generated/prisma/client.js").Role,
    };

    next();
  } catch (error) {
    next(error);
  }
};
