
import { api } from "@/apis/api";
import type {
  GetMySubmissionsResponse,
} from "@/features/submissions/types/submission.types";

type GetMySubmissionsParams = {
  page?: number;
  limit?: number;
};

export const getMySubmissions = async ({
  page = 1,
  limit = 10,
}: GetMySubmissionsParams = {}): Promise<GetMySubmissionsResponse> => {
  return api<GetMySubmissionsResponse>("/submissions/my", {
    query: {
      page,
      limit,
    },
  });
};
