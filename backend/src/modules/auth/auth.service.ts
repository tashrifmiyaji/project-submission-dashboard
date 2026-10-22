
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import type {
  SignupInput,
  LoginInput,
  ChangePasswordInput,
} from "./auth.validation.js";

const SALT_ROUNDS = 12;

const createAccessToken = (userId: string, role: string, email: string): string => {
  return jwt.sign(
    { sub: userId, role, email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: 60 * 60 * 24 },
  );
};

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

export const signup = async (input: SignupInput) => {
  const { name, email, password } = input;

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    return {
      user: sanitizeUser(user),
      accessToken: createAccessToken(user.id, user.role, user.email),
    };
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

export const login = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account is deactivated");
  }

  return {
    user: sanitizeUser(user),
    accessToken: createAccessToken(user.id, user.role, user.email),
  };
};

export const changePassword = async (userId: string, input: ChangePasswordInput) => {
  const { currentPassword, newPassword } = input;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account is deactivated");
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordValid) {
    throw new AppError(400, "Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully" };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (!user.isActive) {
    throw new AppError(403, "Your account is deactivated");
  }

  return user;
};
