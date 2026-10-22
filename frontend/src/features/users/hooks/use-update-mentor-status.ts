"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMentorStatus } from "@/features/users/services/update-mentor-status.service";

export function useUpdateMentorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      mentorId,
      isActive,
    }: {
      mentorId: string;
      isActive: boolean;
    }) => updateMentorStatus(mentorId, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
