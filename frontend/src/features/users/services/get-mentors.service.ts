import { api } from "@/apis/api";

export type Mentor = {
  id: string;
  name: string;
  email: string;
  role: "MENTOR";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GetMentorsResponse = {
  success: boolean;
  message: string;
  data: Mentor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetMentorsParams = {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
};

export const getMentors = async ({
  page,
  limit,
  search,
  isActive,
}: GetMentorsParams): Promise<GetMentorsResponse> => {
  return api<GetMentorsResponse>("/users/mentors", {
    query: {
      page,
      limit,
      ...(search && { search }),
      ...(typeof isActive === "boolean" && { isActive }),
    },
  });
};
