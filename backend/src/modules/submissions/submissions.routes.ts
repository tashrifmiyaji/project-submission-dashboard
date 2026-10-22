import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { submissionRateLimit } from "../../middlewares/submission-rate-limit.middleware.js";
import {
    createSubmissionController,
    getMySubmissionsController,
    getAllSubmissionsController,
    getSubmissionStatsController,
} from "./submissions.controller.js";

const router = Router();

router.use(authMiddleware);

router.post(
    "/",
    authorizeRoles("STUDENT"),
    submissionRateLimit,
    createSubmissionController,
);

router.get(
    "/my",
    authorizeRoles("STUDENT"),
    getMySubmissionsController,
);

router.get(
    "/stats",
    authorizeRoles("ADMIN", "MENTOR"),
    getSubmissionStatsController,
);

router.get(
    "/",
    authorizeRoles("ADMIN", "MENTOR"),
    getAllSubmissionsController,
);

export const submissionsRoutes = router;