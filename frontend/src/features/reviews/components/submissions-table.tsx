"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSubmissions } from "@/features/reviews/hooks/use-submissions";
import type { SubmissionStatus } from "@/features/submissions/types/submission.types";

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  APPROVED: "border-green-500/30 bg-green-500/10 text-green-700",
  REJECTED: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function SubmissionsTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<SubmissionStatus | "ALL">("ALL");
  const limit = 10;
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useSubmissions({
    page,
    limit,
    ...(status !== "ALL" && { status }),
  });

  const errorMessage =
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
      ? error.data.message
      : error instanceof Error
        ? error.message
        : "Failed to load project submissions.";

  const handleStatusChange = (value: string) => {
    if (value === "ALL") {
      setStatus("ALL");
    } else if (value === "APPROVED" || value === "REJECTED") {
      setStatus(value);
    } else {
      return;
    }

    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="submission-status"
          className="text-sm font-medium"
        >
          Filter by status
        </label>
        <select
          id="submission-status"
          value={status}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="ALL">All submissions</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {isPending ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading project submissions...
        </p>
      ) : isError && !data ? (
        <div className="space-y-3 py-8 text-center">
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : !data || data.data.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No project submissions found.
        </p>
      ) : (
        <>
          {isError && (
            <p role="alert" className="text-sm text-destructive">
              Could not refresh submissions. Showing previously loaded data.
            </p>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Project
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Student
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Submitted
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Links
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.data.map((submission) => (
                  <tr key={submission.id} className="align-top">
                    <td className="max-w-xs px-4 py-4">
                      <p className="font-medium text-foreground">
                        {submission.projectName}
                      </p>
                      <p className="mt-1 line-clamp-2 text-muted-foreground">
                        {submission.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {submission.student.name}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {submission.student.email}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[submission.status]}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <a
                          href={submission.repositoryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Repository
                        </a>
                        <a
                          href={submission.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Live project
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1}–
              {Math.min(page * limit, data.meta.total)} of {data.meta.total}{" "}
              submissions
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
                Page {page} of {Math.max(1, data.meta.totalPages)}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={
                  page >= data.meta.totalPages || isPlaceholderData || isError
                }
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
