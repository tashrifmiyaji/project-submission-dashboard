
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { ReviewSubmissionInput } from "./reviews.validation.js";

export const reviewSubmission = async (
    submissionId: string,
    reviewerId: string,
    input: ReviewSubmissionInput,
) => {
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        select: {
            id: true,
            status: true,
        },
    });

    if (!submission) {
        throw new AppError(404, "Submission not found");
    }

    if (submission.status !== "PENDING") {
        throw new AppError(409, "This submission already reviewed");
    }

    try {
        return await prisma.submission.update({
            where: {
                id: submissionId,
                status: "PENDING",
            },
            data: {
                status: input.status,
                reviewComment: input.reviewComment,
                reviewedById: reviewerId,
                reviewedAt: new Date(),
            },
            select: {
                id: true,
                projectName: true,
                repositoryUrl: true,
                liveUrl: true,
                status: true,
                reviewComment: true,
                reviewedAt: true,
                updatedAt: true,
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                reviewedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            throw new AppError(
                409,
                "This submission already reviewed",
            );
        }

        throw error;
    }
};
