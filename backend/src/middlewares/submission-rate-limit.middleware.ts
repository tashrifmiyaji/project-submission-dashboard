import { rateLimit } from "express-rate-limit";

export const submissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId ?? "unauthenticated",
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many project submissions. Please try again later.",
    });
  },
});
