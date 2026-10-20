import type { Role } from "../../generated/prisma/client.js";

declare global {
  namespace Express {
    interface UserPayload {
      userId: string;
      email: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};