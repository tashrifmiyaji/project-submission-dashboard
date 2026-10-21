import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";

import {
  createMentorController,
  getMentorsController,
  updateMentorStatusController,
} from "./users.controller.js";

const router = Router();

router.use(authMiddleware, authorizeRoles("ADMIN"));

router.post("/mentors", createMentorController);

router.get("/mentors", getMentorsController);

router.patch("/mentors/:mentorId/status", updateMentorStatusController);

export const usersRoutes = router;
