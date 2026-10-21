
import { z } from "zod";

export const reviewSubmissionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    error: "Status must be APPROVED or REJECTED",
  }),
  reviewComment: z
    .string()
    .trim()
    .min(5, "Review comment must be at least 5 characters")
    .max(2000, "Review comment cannot exceed 2000 characters"),
});

export type ReviewSubmissionInput = z.infer<
  typeof reviewSubmissionSchema
>;
