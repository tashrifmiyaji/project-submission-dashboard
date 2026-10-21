import bcrypt from "bcrypt";
import { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type {
  CreateMentorInput,
  UpdateMentorStatusInput,
} from "./users.validation.js";
import type { GetMentorsQuery } from "./users.validation.js";

const SALT_ROUNDS = 12;

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const createMentor = async (input: CreateMentorInput) => {
  const { name, email, password } = input;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const mentor = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MENTOR",
      },
    });

    return sanitizeUser(mentor);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "An account with this email already exists");
    }

    throw error;
  }
};

export const getMentors = async (query: GetMentorsQuery) => {
  const { search, isActive, page, limit } = query;

  const where: Prisma.UserWhereInput = {
    role: "MENTOR",

    ...(typeof isActive === "boolean" && { isActive }),

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [mentors, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.user.count({ where }),
  ]);

  return {
    data: mentors,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateMentorStatus = async (
  mentorId: string,
  input: UpdateMentorStatusInput,
) => {
  const mentor = await prisma.user.findUnique({
    where: {
      id: mentorId,
    },
  });

  if (!mentor || mentor.role !== "MENTOR") {
    throw new AppError(404, "Mentor not found");
  }

  const updatedMentor = await prisma.user.update({
    where: {
      id: mentorId,
    },
    data: {
      isActive: input.isActive,
    },
  });

  return sanitizeUser(updatedMentor);
};
