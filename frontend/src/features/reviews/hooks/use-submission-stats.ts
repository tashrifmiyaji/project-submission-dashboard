"use client";

import { useQuery } from "@tanstack/react-query";
import { getSubmissionStats } from "@/features/reviews/services/get-submission-stats.service";

export function useSubmissionStats() {
  return useQuery({
    queryKey: ["submissions", "stats"],
    queryFn: getSubmissionStats,
  });
}
