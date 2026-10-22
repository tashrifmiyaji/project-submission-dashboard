
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMySubmissions } from "@/features/submissions/services/get-my-submissions.service";

type UseMySubmissionsParams = {
  page?: number;
  limit?: number;
};

export function useMySubmissions({
  page = 1,
  limit = 10,
}: UseMySubmissionsParams = {}) {
  return useQuery({
    queryKey: ["submissions", "my", { page, limit }],
    queryFn: () => getMySubmissions({ page, limit }),
  });
}
