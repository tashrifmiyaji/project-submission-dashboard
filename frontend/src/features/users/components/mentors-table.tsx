"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateMentorForm } from "@/features/users/components/create-mentor-form";
import { useMentors } from "@/features/users/hooks/use-mentors";
import { useUpdateMentorStatus } from "@/features/users/hooks/use-update-mentor-status";

export function MentorsTable() {
  const [page, setPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const statusMutation = useUpdateMentorStatus();
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

  const handleStatusToggle = async (
    mentorId: string,
    isActive: boolean,
  ) => {
    try {
      const response = await statusMutation.mutateAsync({
        mentorId,
        isActive,
      });
      toast.success(
        response.message ||
          `Mentor ${isActive ? "activated" : "deactivated"} successfully.`,
      );
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
            : "Unable to update mentor status. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant={isCreateFormOpen ? "outline" : "default"}
          aria-expanded={isCreateFormOpen}
          aria-controls="create-mentor-form"
          onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
        >
          {isCreateFormOpen ? <X /> : <Plus />}
          {isCreateFormOpen ? "Close form" : "Create mentor"}
        </Button>
      </div>

      {isCreateFormOpen && (
        <div
          id="create-mentor-form"
          className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4"
        >
          <CreateMentorForm
            onCreated={() => setIsCreateFormOpen(false)}
            onCancel={() => setIsCreateFormOpen(false)}
          />
        </div>
      )}

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
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm shadow-sm"
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

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-indigo-50 text-slate-700">
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
                  <th scope="col" className="px-4 py-3 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.map((mentor) => (
                  <tr key={mentor.id} className="transition-colors hover:bg-indigo-50/50">
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
                    <td className="px-4 py-4">
                      <Button
                        type="button"
                        size="sm"
                        variant={mentor.isActive ? "destructive" : "outline"}
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          handleStatusToggle(mentor.id, !mentor.isActive)
                        }
                      >
                        {mentor.isActive ? "Deactivate" : "Activate"}
                      </Button>
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
