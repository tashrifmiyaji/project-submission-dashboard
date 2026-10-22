
"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { SubmissionsTable } from "@/features/reviews/components/submissions-table";

function MentorDashboardContent() {
  const { data } = useGetMe();
  const user = data?.data;

  return (
    <main className="min-h-svh px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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
          </div>

          <LogoutButton />
        </div>

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Project Reviews</h2>
            <p className="text-sm text-muted-foreground">
              Browse student projects and filter submissions by review status.
            </p>
          </div>
          <SubmissionsTable />
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
