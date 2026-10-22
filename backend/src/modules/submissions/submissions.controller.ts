
import type { Request, Response } from "express";

import {
    createSubmission,
    getMySubmissions,
    getAllSubmissions,
    getSubmissionStats,
} from "./submissions.service.js";

import {
    createSubmissionSchema,
    getSubmissionsQuerySchema,
} from "./submissions.validation.js";

import { AppError } from "../../utils/AppError.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createSubmissionController = async (req: Request, res: Response ) => {
    if (!req.user?.userId) {
        throw new AppError(401, "Authentication required");
    }

    const parsed = createSubmissionSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(
            400,
            parsed.error.issues[0]?.message ?? "Invalid request data",
        );
    }

    const result = await createSubmission(req.user.userId, parsed.data);

    return sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project submitted successfully",
        data: result,
    });
};

export const getMySubmissionsController = async (req: Request, res: Response ) => {
    if (!req.user?.userId) {
        throw new AppError(401, "Authentication required");
    }

    const parsed = getSubmissionsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        throw new AppError(
            400,
            parsed.error.issues[0]?.message ?? "Invalid query parameters",
        );
    }

    const result = await getMySubmissions(req.user.userId, parsed.data);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Your submissions retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
};

export const getAllSubmissionsController = async (req: Request, res: Response) => {
    const parsed = getSubmissionsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        throw new AppError(
            400,
            parsed.error.issues[0]?.message ?? "Invalid query parameters",
        );
    }

    const result = await getAllSubmissions(parsed.data);

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Submissions retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
};

export const getSubmissionStatsController = async (_req: Request, res: Response) => {
    const result = await getSubmissionStats();

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Submission statistics retrieved successfully",
        data: result,
    });
};
