
import { api } from "@/apis/api";

import type { CreateSubmissionFormValues } from "@/features/submissions/schemas/create-submission.schema";
import type { CreateSubmissionResponse } from "@/features/submissions/types/submission.types";

export const createSubmission = async (
  values: CreateSubmissionFormValues,
): Promise<CreateSubmissionResponse> => {
  return api<CreateSubmissionResponse>("/submissions", {
    method: "POST",
    body: values,
  });
};
