
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetMe } from "@/features/auth/hooks/use-get-me";

export function GuestGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending || isError || !user) {
      return;
    }

    if (user.role === "ADMIN") {
      router.replace("/admin/dashboard");
    } else if (user.role === "MENTOR") {
      router.replace("/mentor/dashboard");
    } else {
      router.replace("/student/dashboard");
    }
  }, [isPending, isError, router, user]);

  if (!isError && user) {
    return null;
  }

  return children;
}
