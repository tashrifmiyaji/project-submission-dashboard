
import Link from "next/link";

import { SignupForm } from "@/features/auth/components/signup-form";
import { GuestGuard } from "@/features/auth/components/guest-guard";

export default function SignupPage() {
  return (
    <GuestGuard>
      <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-6 shadow-sm sm:p-8">
          <div className="space-y-2 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Project Submission Dashboard
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
