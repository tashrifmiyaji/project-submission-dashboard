import { api } from "@/apis/api";
import { LogoutResponse } from "../types/auth.types";

export const logout = async (): Promise<LogoutResponse> => {
  return api<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
};
