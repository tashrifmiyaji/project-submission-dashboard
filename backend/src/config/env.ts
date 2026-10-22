import "dotenv/config";

const requiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const accessTokenTtl = Number(
  requiredEnv("ACCESS_TOKEN_TTL_SECONDS"),
);

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: requiredEnv("DATABASE_URL"),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  JWT_ACCESS_SECRET: requiredEnv("JWT_ACCESS_SECRET"),
  ACCESS_TOKEN_TTL_SECONDS: requiredEnv("ACCESS_TOKEN_TTL_SECONDS"),
  ADMIN_NAME: requiredEnv("ADMIN_NAME"),
  ADMIN_EMAIL: requiredEnv("ADMIN_EMAIL"),
  ADMIN_PASSWORD: requiredEnv("ADMIN_PASSWORD"),
};
