import { api } from "@/apis/api";
import type {
  GetAllSubmissionsResponse,
  SubmissionStatus,
} from "@/features/submissions/types/submission.types";

export type GetSubmissionsParams = {
  page: number;
  limit: number;
  status?: SubmissionStatus;
};

export const getSubmissions = async ({
  page,
  limit,
  status,
}: GetSubmissionsParams): Promise<GetAllSubmissionsResponse> => {
  return api<GetAllSubmissionsResponse>("/submissions", {
    query: {
      page,
      limit,
      ...(status && { status }),
    },
  });
};
