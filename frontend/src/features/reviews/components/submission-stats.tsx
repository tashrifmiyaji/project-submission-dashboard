"use client";

import { useSubmissionStats } from "@/features/reviews/hooks/use-submission-stats";
import { Button } from "@/components/ui/button";

const STAT_CARDS = [
  {
    key: "total",
    label: "Total submissions",
    style: "border-indigo-200 bg-indigo-50",
  },
  {
    key: "pending",
    label: "Pending",
    style: "border-amber-200 bg-amber-50",
  },
  {
    key: "approved",
    label: "Approved",
    style: "border-emerald-200 bg-emerald-50",
  },
  {
    key: "rejected",
    label: "Rejected",
    style: "border-rose-200 bg-rose-50",
  },
] as const;

export function SubmissionStats() {
  const { data, isPending, isError, error, refetch } = useSubmissionStats();

  if (isPending) {
    return (
      <div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Loading submission statistics"
      >
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    const message =
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
          : "Failed to load submission statistics.";

    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
        <Button type="button" variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARDS.map((card) => (
        <article
          key={card.key}
          className={`rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${card.style}`}
        >
          <h2 className="text-sm font-medium text-muted-foreground">
            {card.label}
          </h2>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {data.data[card.key]}
          </p>
        </article>
      ))}
    </div>
  );
}
