"use client";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";

function AdminDashboardContent() {
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
              Admin Dashboard
            </h1>

            <p className="text-muted-foreground">
              Welcome back{user?.name ? `, ${user.name}` : ""}!
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Mentor Management</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create mentors, search mentor accounts, and manage their active
            status.
          </p>
        </section>

        <section className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold">Project Submissions</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            View submissions, filter by review status, and monitor project
            evaluations.
          </p>
        </section>
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
