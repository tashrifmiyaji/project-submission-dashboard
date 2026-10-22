"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewSubmission } from "@/features/reviews/services/review-submission.service";

export function useReviewSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      status,
      reviewComment,
    }: {
      submissionId: string;
      status: "APPROVED" | "REJECTED";
      reviewComment: string;
    }) =>
      reviewSubmission(submissionId, {
        status,
        reviewComment,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["submissions"],
      });
    },
  });
}
