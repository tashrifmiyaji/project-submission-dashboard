"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMentors } from "@/features/users/hooks/use-mentors";

export function MentorsTable() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const limit = 10;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useMentors({
    page,
    limit,
    ...(search && { search }),
    ...(status !== "ALL" && { isActive: status === "ACTIVE" }),
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
        : "Failed to load mentors.";

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="mentor-search" className="text-sm font-medium">
            Search mentors
          </label>
          <Input
            id="mentor-search"
            type="search"
            placeholder="Search by name or email"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mentor-status" className="text-sm font-medium">
            Filter by status
          </label>
          <select
            id="mentor-status"
            value={status}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "ALL" ||
                value === "ACTIVE" ||
                value === "INACTIVE"
              ) {
                setStatus(value);
                setPage(1);
              }
            }}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="ALL">All mentors</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {isPending ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading mentors...
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
          No mentors found.
        </p>
      ) : (
        <>
          {isError && (
            <p role="alert" className="text-sm text-destructive">
              Could not refresh mentors. Showing previously loaded data.
            </p>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Mentor
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Created
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.data.map((mentor) => (
                  <tr key={mentor.id}>
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">
                        {mentor.name}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {mentor.email}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                      {new Date(mentor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                          mentor.isActive
                            ? "border-green-500/30 bg-green-500/10 text-green-700"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {mentor.isActive ? "Active" : "Inactive"}
                      </span>
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
              mentors
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
                disabled={page >= data.meta.totalPages || isPlaceholderData || isError}
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
