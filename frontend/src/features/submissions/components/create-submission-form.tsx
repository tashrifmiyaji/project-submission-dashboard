
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  createSubmissionSchema,
  type CreateSubmissionFormValues,
} from "@/features/submissions/schemas/create-submission.schema";
import { useCreateSubmission } from "@/features/submissions/hooks/use-create-submission";

export function CreateSubmissionForm() {
  const submissionMutation = useCreateSubmission();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSubmissionFormValues>({
    resolver: zodResolver(createSubmissionSchema),
    defaultValues: {
      projectName: "",
      repositoryUrl: "",
      liveUrl: "",
      description: "",
    },
  });

  const onSubmit = async (values: CreateSubmissionFormValues) => {
    try {
      await submissionMutation.mutateAsync(values);
      reset();
      toast.success("Project submitted successfully.");
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
            : "Unable to submit your project. Please try again.";

      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          placeholder="My Full-Stack Project"
          disabled={submissionMutation.isPending}
          aria-invalid={!!errors.projectName}
          {...register("projectName")}
        />
        {errors.projectName && (
          <p className="text-sm text-destructive">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="repositoryUrl">GitHub Repository URL</Label>
        <Input
          id="repositoryUrl"
          type="url"
          placeholder="https://github.com/username/repository"
          disabled={submissionMutation.isPending}
          aria-invalid={!!errors.repositoryUrl}
          {...register("repositoryUrl")}
        />
        {errors.repositoryUrl && (
          <p className="text-sm text-destructive">
            {errors.repositoryUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="liveUrl">Live Project URL</Label>
        <Input
          id="liveUrl"
          type="url"
          placeholder="https://your-project.vercel.app"
          disabled={submissionMutation.isPending}
          aria-invalid={!!errors.liveUrl}
          {...register("liveUrl")}
        />
        {errors.liveUrl && (
          <p className="text-sm text-destructive">
            {errors.liveUrl.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your project, its features, and technologies..."
          rows={5}
          disabled={submissionMutation.isPending}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={submissionMutation.isPending}
      >
        {submissionMutation.isPending && (
          <LoaderCircle className="animate-spin" />
        )}
        {submissionMutation.isPending
          ? "Submitting project..."
          : "Submit Project"}
      </Button>
    </form>
  );
}
