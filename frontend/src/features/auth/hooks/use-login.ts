"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { login } from "@/features/auth/services/login.service";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { GetMeResponse } from "@/features/auth/types/auth.types";

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginFormValues) => login(credentials),

        onSuccess: (response) => {
            const meResponse: GetMeResponse = {
                success: response.success,
                message: response.message,
                data: response.data.user,
            };

            queryClient.setQueryData(["auth", "me"], meResponse);
        },
    });
}
