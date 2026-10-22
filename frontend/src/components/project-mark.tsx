import { FolderKanban } from "lucide-react";

export function ProjectMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl ${className}`}
    >
      <FolderKanban className="size-8" strokeWidth={2.4} />
    </span>
  );
}
