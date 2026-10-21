import type { RequestHandler } from "express";
import type { Role } from "../generated/prisma/client.js";

import { AppError } from "../utils/AppError.js";

export const authorizeRoles = (...allowedRoles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user?.userId || !req.user.role) {
      return next(new AppError(401, "Authentication required"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(403, "You do not have permission to perform this action"),
      );
    }

    next();
  };
};
