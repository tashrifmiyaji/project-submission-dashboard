"use client";

import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewSubmission } from "@/features/reviews/hooks/use-review-submission";
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
  const [reviewTarget, setReviewTarget] = useState<{
    id: string;
    status: "APPROVED" | "REJECTED";
  } | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const reviewMutation = useReviewSubmission();
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

  const handleReviewSubmit = async () => {
    if (!reviewTarget) return;

    const comment = reviewComment.trim();
    if (comment.length < 5) {
      toast.error("Review comment must be at least 5 characters.");
      return;
    }
    if (comment.length > 2000) {
      toast.error("Review comment cannot exceed 2000 characters.");
      return;
    }

    try {
      await reviewMutation.mutateAsync({
        submissionId: reviewTarget.id,
        status: reviewTarget.status,
        reviewComment: comment,
      });
      toast.success(
        reviewTarget.status === "APPROVED"
          ? "Project approved successfully."
          : "Project rejected successfully.",
      );
      setReviewTarget(null);
      setReviewComment("");
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
            : "Unable to review this project. Please try again.";
      toast.error(message);
    }
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
          className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm"
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

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-indigo-50 text-slate-700">
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
                  <th scope="col" className="px-4 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((submission) => (
                  <Fragment key={submission.id}>
                    <tr className="align-top transition-colors hover:bg-indigo-50/50">
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
                      <td className="px-4 py-4">
                        {submission.status === "PENDING" ? (
                          <div className="flex flex-col items-start gap-2">
                            <Button
                              type="button"
                              size="sm"
                              disabled={reviewMutation.isPending}
                              onClick={() => {
                                setReviewTarget({
                                  id: submission.id,
                                  status: "APPROVED",
                                });
                                setReviewComment("");
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              disabled={reviewMutation.isPending}
                              onClick={() => {
                                setReviewTarget({
                                  id: submission.id,
                                  status: "REJECTED",
                                });
                                setReviewComment("");
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Reviewed</span>
                        )}
                      </td>
                    </tr>
                    {submission.status !== "PENDING" && (
                      <tr>
                        <td
                          colSpan={6}
                          className="border-t border-indigo-100 bg-indigo-50/70 px-4 py-4"
                        >
                          <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                            <div className="space-y-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                {submission.status === "APPROVED"
                                  ? "Approval feedback"
                                  : "Rejection reason"}
                              </p>
                              <p className="whitespace-pre-wrap text-sm text-slate-800">
                                {submission.reviewComment ??
                                  "No review comment was recorded."}
                              </p>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Reviewed by
                              </p>
                              {submission.reviewedBy ? (
                                <>
                                  <p className="font-medium text-slate-900">
                                    {submission.reviewedBy.name} (
                                    {submission.reviewedBy.role === "ADMIN"
                                      ? "Admin"
                                      : "Mentor"}
                                    )
                                  </p>
                                  <p className="text-slate-600">
                                    {submission.reviewedBy.email}
                                  </p>
                                </>
                              ) : (
                                <p className="text-slate-600">
                                  Reviewer information is unavailable.
                                </p>
                              )}
                              {submission.reviewedAt && (
                                <p className="pt-1 text-xs text-slate-600">
                                  {new Date(
                                    submission.reviewedAt,
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {reviewTarget?.id === submission.id && (
                      <tr>
                        <td colSpan={6} className="bg-indigo-50/70 px-4 py-4">
                          <div className="mx-auto max-w-2xl space-y-3">
                            <label
                              htmlFor={`review-comment-${submission.id}`}
                              className="block text-sm font-medium"
                            >
                              {reviewTarget.status === "APPROVED"
                                ? "Feedback for approval"
                                : "Reason for rejection"}{" "}
                              <span className="text-muted-foreground">
                                (required)
                              </span>
                            </label>
                            <Textarea
                              id={`review-comment-${submission.id}`}
                              value={reviewComment}
                              onChange={(event) =>
                                setReviewComment(event.target.value)
                              }
                              placeholder="Write constructive feedback for the student..."
                              rows={3}
                              maxLength={2000}
                              disabled={reviewMutation.isPending}
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <p className="text-xs text-muted-foreground">
                                {reviewComment.length}/2000 characters · at
                                least 5 required
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  disabled={reviewMutation.isPending}
                                  onClick={() => {
                                    setReviewTarget(null);
                                    setReviewComment("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant={
                                    reviewTarget.status === "REJECTED"
                                      ? "destructive"
                                      : "default"
                                  }
                                  disabled={reviewMutation.isPending}
                                  onClick={handleReviewSubmit}
                                >
                                  {reviewMutation.isPending
                                    ? "Saving review..."
                                    : `Confirm ${reviewTarget.status === "APPROVED" ? "approval" : "rejection"}`}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
