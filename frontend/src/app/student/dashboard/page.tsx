"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { CreateSubmissionForm } from "@/features/submissions/components/create-submission-form";
import { MySubmissionsList } from "@/features/submissions/components/my-submissions-list";

const ALLOWED_ROLES = ["STUDENT"] as const;

function StudentDashboardContent() {
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
            Student Dashboard
          </h1>

          <p className="text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}!
          </p>
          <LogoutButton />
        </div>

      
        <section className="rounded-xl border bg-card p-6">
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-semibold">Submit a Project</h2>

            <p className="text-sm text-muted-foreground">
              Submit your project repository and live link for review.
            </p>
          </div>

          <CreateSubmissionForm />
        </section>

        <section className="space-y-6 rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Your Projects</h2>

            <p className="text-sm text-muted-foreground">
              Track your submitted projects and review status.
            </p>
          </div>

          <MySubmissionsList />
        </section>

      </div>
    </main>
  );
}

export default function StudentDashboardPage() {
  return (
    <AuthGuard allowedRoles={[...ALLOWED_ROLES]}>
      <StudentDashboardContent />
    </AuthGuard>
  );
}
