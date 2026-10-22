
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { GuestGuard } from "@/features/auth/components/guest-guard";
import { ProjectMark } from "@/components/project-mark";

export default function LoginPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-svh items-center justify-center bg-gradient-to-br from-slate-200 via-indigo-100 to-violet-200 px-4 py-12 dark:from-slate-950 dark:via-indigo-950 dark:to-violet-950">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ProjectMark className="size-12 bg-indigo-100 text-indigo-700" />
              <span>Project Submission Dashboard</span>
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15 sm:p-8 dark:border-white/10 dark:bg-slate-900">
            <LoginForm />
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create a student account
            </Link>
          </p>
        </div>
      </main>
    </GuestGuard>
  );
}
