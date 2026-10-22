"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getSubmissions,
  type GetSubmissionsParams,
} from "@/features/reviews/services/get-submissions.service";

export function useSubmissions(params: GetSubmissionsParams) {
  return useQuery({
    queryKey: ["submissions", "all", params],
    queryFn: () => getSubmissions(params),
    placeholderData: (previousData) => previousData,
  });
}
