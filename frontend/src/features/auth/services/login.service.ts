import { api } from "@/apis/api";
import type { LoginFormValues } from "@/features/auth/schemas/login.schema";
import type { LoginResponse } from "@/features/auth/types/auth.types";

export const login = async (credentials: LoginFormValues): Promise<LoginResponse> => {
    return api<LoginResponse>("/auth/login", {
        method: "POST",
        body: credentials,
    });
};