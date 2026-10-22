"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createMentorSchema,
  type CreateMentorValues,
} from "@/features/users/schemas/create-mentor.schema";
import { useCreateMentor } from "@/features/users/hooks/use-create-mentor";

type CreateMentorFormProps = {
  onCreated: () => void;
  onCancel: () => void;
};

export function CreateMentorForm({
  onCreated,
  onCancel,
}: CreateMentorFormProps) {
  const createMutation = useCreateMentor();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMentorValues>({
    resolver: zodResolver(createMentorSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: CreateMentorValues) => {
    try {
      const response = await createMutation.mutateAsync(values);
      toast.success(response.message || "Mentor account created.");
      reset();
      onCreated();
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
            : "Unable to create mentor account. Please try again.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mentor-name">Full name</Label>
          <Input
            id="mentor-name"
            autoComplete="name"
            disabled={createMutation.isPending}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mentor-email">Email</Label>
          <Input
            id="mentor-email"
            type="email"
            autoComplete="email"
            disabled={createMutation.isPending}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="mentor-password">Temporary password</Label>
          <Input
            id="mentor-password"
            type="password"
            autoComplete="new-password"
            disabled={createMutation.isPending}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <p className="text-xs text-muted-foreground">
            Use 8 to 72 characters and share the password with the mentor
            securely.
          </p>
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={createMutation.isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending && (
            <LoaderCircle className="animate-spin" />
          )}
          {createMutation.isPending ? "Creating..." : "Create mentor"}
        </Button>
      </div>
    </form>
  );
}
