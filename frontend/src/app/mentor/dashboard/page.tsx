
"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";

function MentorDashboardContent() {
  const { data } = useGetMe();
  const user = data?.data;

  return (
    <main className="min-h-svh px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Project Submission Dashboard
          </p>

          <h1 className="text-3xl font-bold tracking-tight">
            Mentor Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </p>
          <LogoutButton />
        </div>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Project Reviews</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Review student submissions, update their status, and manage
            project evaluations.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function MentorDashboardPage() {
  return (
    <AuthGuard allowedRoles={["MENTOR"]}>
      <MentorDashboardContent />
    </AuthGuard>
  );
}
