"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useGetMe } from "@/features/auth/hooks/use-get-me";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { CreateSubmissionForm } from "@/features/submissions/components/create-submission-form";
import { MySubmissionsList } from "@/features/submissions/components/my-submissions-list";
import { Button } from "@/components/ui/button";

const ALLOWED_ROLES = ["STUDENT"] as const;

function StudentDashboardContent() {
  const { data } = useGetMe();
  const user = data?.data;
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);

  return (
    <main className="min-h-svh px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
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
          </div>

          <LogoutButton />
        </div>

        <section className="space-y-4 rounded-xl border bg-card p-6">
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
