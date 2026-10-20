import { env } from "./config/env.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";

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

export default app;