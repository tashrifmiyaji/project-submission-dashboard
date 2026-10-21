
import type { RequestHandler } from "express";
import { AppError } from "../../utils/AppError.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { reviewSubmissionSchema } from "./reviews.validation.js";
import { reviewSubmission } from "./reviews.service.js";

export const reviewSubmissionController: RequestHandler = async (req, res) => {
    const reviewerId = req.user?.userId;

    const { submissionId } = req.params;

    if (!submissionId) {
        throw new AppError(400, "Submission ID is required");
    }

    const parsed = reviewSubmissionSchema.safeParse(req.body);

    if (!parsed.success) {
        throw new AppError(
            400,
            parsed.error.issues[0]?.message ?? "Invalid request data",
        );
    }

    const result = await reviewSubmission(
        submissionId as string,
        reviewerId as string,
        parsed.data,
    );

    return sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Submission reviewed successfully",
        data: result,
    });
};
