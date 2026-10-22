
"use client";

import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();

      router.replace("/login");
      router.refresh();
    } catch {
      // Logout failed; remain on the current page.
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
