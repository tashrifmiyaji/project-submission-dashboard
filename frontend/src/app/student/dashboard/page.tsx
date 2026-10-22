"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { CreateSubmissionForm } from "@/features/submissions/components/create-submission-form";
import { MySubmissionsList } from "@/features/submissions/components/my-submissions-list";
import { Button } from "@/components/ui/button";
import { ProjectMark } from "@/components/project-mark";

const ALLOWED_ROLES = ["STUDENT"] as const;

function StudentDashboardContent() {
  const { data } = useGetMe();
  const user = data?.data;
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  return (
    <main className="min-h-svh bg-gradient-to-br from-slate-200 via-indigo-100 to-violet-200 px-6 py-12 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:flex-row sm:items-start sm:justify-between sm:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <ProjectMark className="size-12 bg-white/10 text-white ring-1 ring-white/20" />
              <p className="text-sm font-semibold tracking-wide text-blue-100">
                Project Submission Dashboard
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Student Dashboard
            </h1>

            <p className="text-base text-blue-100">
              Welcome back
              {user?.name && (
                <>
                  ,{" "}
                  <span className="rounded-md bg-amber-300 px-2 py-1 font-bold text-indigo-950 shadow-sm">
                    {user.name}
                  </span>
                </>
              )}
              !
            </p>
          </div>

          <LogoutButton />
        </div>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Submit a Project</h2>

              <p className="text-sm text-muted-foreground">
                Submit your project repository and live link for review.
              </p>
            </div>

            <Button
              type="button"
              className="w-full sm:w-auto"
              aria-expanded={isSubmissionFormOpen}
              aria-controls="create-submission-form"
              onClick={() => setIsSubmissionFormOpen((isOpen) => !isOpen)}
            >
              {isSubmissionFormOpen ? <X /> : <Plus />}
              {isSubmissionFormOpen ? "Close form" : "Submit a Project"}
            </Button>
          </div>

          {isSubmissionFormOpen && (
            <div id="create-submission-form" className="border-t pt-6">
              <CreateSubmissionForm />
            </div>
          )}
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10 dark:border-white/10 dark:bg-slate-900">
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
