import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { reviewSubmissionController } from "./reviews.controller.js";

const router = Router();

router.use(authMiddleware, authorizeRoles("ADMIN", "MENTOR"));

router.patch("/:submissionId", reviewSubmissionController);

export const reviewsRoutes = router;
