"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMentor } from "@/features/users/services/create-mentor.service";
import type { CreateMentorValues } from "@/features/users/schemas/create-mentor.schema";

export function useCreateMentor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: CreateMentorValues) => createMentor(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
