"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup } from "@/features/auth/services/signup.service";
import type { SignupFormValues } from "@/features/auth/schemas/signup.schema";
import type { GetMeResponse } from "@/features/auth/types/auth.types";

export function useSignup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: SignupFormValues) => signup(values),

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
