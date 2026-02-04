"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useTenant } from "@/contexts/TenantContext";
import { Loader2 } from "lucide-react";

/**
 * Dashboard Redirector
 * Redirects users to their role-specific dashboard based on their role from session.
 */
export default function DashboardRedirector() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { currentRole } = useTenant();

  useEffect(() => {
    if (isPending) return; // Wait for session to load

    if (!session) {
      // Not authenticated, redirect to signup
      router.replace("/signup");
      return;
    }

    // Get role from tenant context or session
    const role = currentRole || (session.user as any)?.role;

    if (role) {
      const normalizedRole = role.toLowerCase();
      router.replace(`/${normalizedRole}/dashboard`);
    } else {
      // Role not yet assigned (onboarding incomplete), redirect to a default or onboarding page
      // For now, let's redirect to student dashboard as fallback
      router.replace("/student/dashboard");
    }
  }, [session, isPending, currentRole, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
