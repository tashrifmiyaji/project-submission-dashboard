
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signup.schema";
import { useSignup } from "@/features/auth/hooks/use-signup";

export function SignupForm() {
  const router = useRouter();
  const signupMutation = useSignup();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      const response = await signupMutation.mutateAsync(values);
      toast.success(response.message || "Account created successfully.");
      const role = response.data.user.role;

      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "MENTOR") {
        router.replace("/mentor/dashboard");
      } else {
        router.replace("/student/dashboard");
      }

      router.refresh();
    } catch (error) {
      const data =
        typeof error === "object" && error !== null && "data" in error
          ? error.data
          : null;
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
          ? data.message
          : error instanceof Error
            ? error.message
            : "Unable to create your account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Your full name"
          autoComplete="name"
          disabled={signupMutation.isPending}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={signupMutation.isPending}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={signupMutation.isPending}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={signupMutation.isPending}
      >
        {signupMutation.isPending && (
          <LoaderCircle className="animate-spin" />
        )}
        {signupMutation.isPending
          ? "Creating account..."
          : "Create Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
