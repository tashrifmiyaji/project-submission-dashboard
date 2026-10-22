
"use client";

import Link from "next/link";
import { useState } from "react";
import { useMySubmissions } from "@/features/submissions/hooks/use-my-submissions";
import type { SubmissionStatus } from "@/features/submissions/types/submission.types";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  PENDING: "Pending Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  APPROVED: "border-green-500/30 bg-green-500/10 text-green-700",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function MySubmissionsList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useMySubmissions({ page, limit });

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading your projects...
      </p>
    );
  }

  if (isError && !data) {
    return (
      <div className="space-y-3">
        <p role="alert" className="text-sm text-destructive">
          {(
            error as { data?: { message?: string }; message?: string }
          ).data?.message ?? error.message ?? "Failed to load your projects."}
        </p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) return null;

  if (data.data.length === 0 && page === 1) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven&apos;t submitted any projects yet.
      </p>
    );
  }

  const { total, totalPages } = data.meta;

  return (
    <div className="space-y-4">
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          Could not refresh the projects. Showing the previously loaded data.
        </p>
      )}

      {data.data.map((submission) => (
        <article
          key={submission.id}
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <h3 className="font-semibold">{submission.projectName}</h3>
              <p className="text-sm text-muted-foreground">
                Submitted{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-3 py-1 text-xs font-medium ${STATUS_STYLES[submission.status]}`}
            >
              {STATUS_LABELS[submission.status]}
            </span>
          </div>

          <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {submission.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link
              href={submission.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              GitHub Repository
            </Link>

            <Link
              href={submission.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Live Project
            </Link>
          </div>

          {submission.reviewComment && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Reviewer Feedback</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {submission.reviewComment}
              </p>
            </div>
          )}
        </article>
      ))}

      <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {total === 0 ? 0 : (page - 1) * limit + 1}
          {"–"}
          {Math.min(page * limit, total)} of {total} projects
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1 || isPlaceholderData}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>

          <span className="whitespace-nowrap text-sm text-muted-foreground">
            Page {page} of {Math.max(1, totalPages)}
          </span>

          <Button
            type="button"
            variant="outline"
            disabled={
              page >= totalPages ||
              isPlaceholderData ||
              isError
            }
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
