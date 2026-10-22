import { api } from "@/apis/api";
import type { SubmissionStatus } from "@/features/submissions/types/submission.types";

export type ReviewSubmissionInput = {
  status: Extract<SubmissionStatus, "APPROVED" | "REJECTED">;
  reviewComment: string;
};

export const reviewSubmission = async (
  submissionId: string,
  input: ReviewSubmissionInput,
): Promise<void> => {
  await api(`/reviews/${encodeURIComponent(submissionId)}`, {
    method: "PATCH",
    body: input,
  });
};
