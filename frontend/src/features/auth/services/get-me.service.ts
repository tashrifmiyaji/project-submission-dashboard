import { api } from "@/apis/api";
import type { GetMeResponse } from "@/features/auth/types/auth.types";

export const getMe = async (): Promise<GetMeResponse> => {
  return api<GetMeResponse>("/auth/me", {
    method: "GET",
  });
};

