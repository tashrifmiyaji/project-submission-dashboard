"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSubmission } from "@/features/submissions/services/create-submission.service";
import type { CreateSubmissionFormValues } from "@/features/submissions/schemas/create-submission.schema";

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateSubmissionFormValues) =>
      createSubmission(values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["submissions", "my"],
      });
    },
  });
}
