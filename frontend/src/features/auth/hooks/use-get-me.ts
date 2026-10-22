
"use client";

import { useQuery } from "@tanstack/react-query";

import { getMe } from "@/features/auth/services/get-me.service";

export function useGetMe() {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
    });
}
