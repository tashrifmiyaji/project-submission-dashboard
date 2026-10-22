
import { api } from "@/apis/api";
import type { SignupFormValues } from "@/features/auth/schemas/signup.schema";
import type { SignupResponse } from "@/features/auth/types/auth.types";

export const signup = async (
  values: SignupFormValues,
): Promise<SignupResponse> => {
  return api<SignupResponse>("/auth/signup", {
    method: "POST",
    body: values,
  });
};
