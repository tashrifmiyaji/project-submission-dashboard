import { api } from "@/apis/api";
import type { Mentor } from "@/features/users/services/get-mentors.service";

type UpdateMentorStatusResponse = {
  success: boolean;
  message: string;
  data: Mentor;
};

export const updateMentorStatus = async (
  mentorId: string,
  isActive: boolean,
): Promise<UpdateMentorStatusResponse> => {
  return api<UpdateMentorStatusResponse>(
    `/users/mentors/${encodeURIComponent(mentorId)}/status`,
    {
      method: "PATCH",
      body: { isActive },
    },
  );
};
