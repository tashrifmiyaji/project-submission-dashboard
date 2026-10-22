import { api } from "@/apis/api";
import type { CreateMentorValues } from "@/features/users/schemas/create-mentor.schema";
import type { Mentor } from "@/features/users/services/get-mentors.service";

type CreateMentorResponse = {
  success: boolean;
  message: string;
  data: Mentor;
};

export const createMentor = async (
  values: CreateMentorValues,
): Promise<CreateMentorResponse> => {
  return api<CreateMentorResponse>("/users/mentors", {
    method: "POST",
    body: values,
  });
};
