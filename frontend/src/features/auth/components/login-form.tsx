"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/apis/api";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/login.schema";
import { useLogin } from "@/features/auth/hooks/use-login";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [isWakingServer, setIsWakingServer] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginMutation.mutateAsync(values);
      toast.success(response.message || "Signed in successfully.");

      const { role } = response.data.user;
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "MENTOR") {
        router.replace("/mentor/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
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
            : "Unable to sign in. Please try again.";
      toast.error(message);
    }
  };

  const wakeServer = async () => {
    setIsWakingServer(true);
    try {
      const response = await api<{ success: boolean; message: string }>(
        "/health",
      );
      toast.success(response.message || "Server is active and ready.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not reach the server. Please try again.";
      toast.error(message);
    } finally {
      setIsWakingServer(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          disabled={loginMutation.isPending}
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
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          disabled={loginMutation.isPending}
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
        disabled={loginMutation.isPending || isWakingServer}
      >
        {loginMutation.isPending && (
          <LoaderCircle className="animate-spin" />
        )}

        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={wakeServer}
        disabled={loginMutation.isPending || isWakingServer}
      >
        {isWakingServer ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Server />
        )}
        {isWakingServer ? "Activating server..." : "Activate Server"}
      </Button>
    </form>
  );
}
