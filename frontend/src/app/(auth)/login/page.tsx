
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Project Submission Dashboard
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
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
  );
}
