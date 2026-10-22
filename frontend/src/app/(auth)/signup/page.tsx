
import Link from "next/link";

import { SignupForm } from "@/features/auth/components/signup-form";
import { GuestGuard } from "@/features/auth/components/guest-guard";
import { ProjectMark } from "@/components/project-mark";

export default function SignupPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-200 via-indigo-100 to-violet-200 p-4 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15 sm:p-8 dark:border-white/10 dark:bg-slate-900">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-left text-sm text-muted-foreground hover:text-foreground"
            >
              <ProjectMark className="size-12 bg-indigo-100 text-indigo-700" />
              <span>Project Submission Dashboard</span>
            </Link>

            <h1 className="text-2xl font-bold tracking-tight">
              Create an account
            </h1>

            <p className="text-sm text-muted-foreground">
              Sign up to submit and manage your projects.
            </p>
          </div>

          <SignupForm />
        </div>
      </main>
    </GuestGuard>
  );
}
