
"use client";

import { useMutation } from "@tanstack/react-query";

import { signup } from "@/features/auth/services/signup.service";
import type { SignupFormValues } from "@/features/auth/schemas/signup.schema";

export function useSignup() {
  return useMutation({
    mutationFn: (values: SignupFormValues) => signup(values),
  });
}
