"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/features/auth/services/login.service";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";

export function useLogin() {
    return useMutation({
        mutationFn: (credentials: LoginFormValues) => login(credentials),
    });
}