
"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      const response = await logoutMutation.mutateAsync();
      toast.success(response.message || "Logged out successfully.");

      router.replace("/login");
      router.refresh();
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
            : "Unable to log out. Please try again.";
      toast.error(message);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <LogOut />
      )}

      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
