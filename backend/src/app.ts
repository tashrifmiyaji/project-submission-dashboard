import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFound } from "./middlewares/notFound.js";
import { globalError } from "./middlewares/globalError.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { usersRoutes } from "./modules/user/users.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL, 
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Project Submission Dashboard API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use(notFound);
app.use(globalError);

export default app;