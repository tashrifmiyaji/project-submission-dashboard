import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

import type {
  CreateSubmissionInput,
  GetSubmissionsQuery,
} from "./submissions.validation.js";

export const createSubmission = async (
  studentId: string,
  input: CreateSubmissionInput,
) => {
  try {
    return await prisma.submission.create({
      data: {
        ...input,
        studentId,
      },
      select: {
        id: true,
        projectName: true,
        repositoryUrl: true,
        liveUrl: true,
        description: true,
        status: true,
        reviewComment: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(
        409,
        "You have already submitted this repository",
      );
    }

    throw error;
  }
};

export const getMySubmissions = async (
  studentId: string,
  query: GetSubmissionsQuery,
) => {
  const { status, search, page, limit } = query;

  const where: Prisma.SubmissionWhereInput = {
    studentId,
    ...(status && { status }),
    ...(search && {
      projectName: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const [submissions, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      select: {
        id: true,
        projectName: true,
        repositoryUrl: true,
        liveUrl: true,
        description: true,
        status: true,
        reviewComment: true,
        reviewedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.submission.count({ where }),
  ]);

  return {
    data: submissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


export const getAllSubmissions = async (
  query: GetSubmissionsQuery,
) => {
  const { status, search, page, limit } = query;

  const where: Prisma.SubmissionWhereInput = {
    ...(status && { status }),

    ...(search && {
      OR: [
        {
          projectName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          student: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          student: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    }),
  };

  const [submissions, total] = await prisma.$transaction([
    prisma.submission.findMany({
      where,
      select: {
        id: true,
        projectName: true,
        repositoryUrl: true,
        liveUrl: true,
        description: true,
        status: true,
        reviewComment: true,
        reviewedAt: true,
        createdAt: true,
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
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.submission.count({ where }),
  ]);

  return {
    data: submissions,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSubmissionStats = async () => {
  const statusCounts = await prisma.submission.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  const counts = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
  };

  for (const item of statusCounts) {
    counts[item.status] = item._count._all;
  }

  return {
    total: counts.PENDING + counts.APPROVED + counts.REJECTED,
    pending: counts.PENDING,
    approved: counts.APPROVED,
    rejected: counts.REJECTED,
  };
};
