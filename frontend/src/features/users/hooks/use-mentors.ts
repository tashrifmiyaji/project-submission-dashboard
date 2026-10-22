"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMentors,
  type GetMentorsParams,
} from "@/features/users/services/get-mentors.service";

export function useMentors(params: GetMentorsParams) {
  return useQuery({
    queryKey: ["mentors", params],
    queryFn: () => getMentors(params),
    placeholderData: (previousData) => previousData,
  });
}
