"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetMe } from "@/features/auth/hooks/use-get-me";
import type { UserRole } from "@/features/auth/types/auth.types";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  const user = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isError || !user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      if (user.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (user.role === "MENTOR") {
        router.replace("/mentor/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [allowedRoles, isError, isPending, router, user]);

  if (isPending || isError || !user) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </main>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return null;
  }

  return children;
}
