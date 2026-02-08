"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { currentRole } = useTenant();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentRole) {
      return;
    }

    const role = currentRole.toLowerCase();

    const allowedPrefixes: Record<string, string> = {
      student: "/student",
      teacher: "/teacher",
      admin: "/admin",
      parent: "/parent",
    };

    const allowedPrefix = allowedPrefixes[role];
    const isCommonRoute = pathname === "/settings" || pathname === "/profile";

    if (!pathname.startsWith(allowedPrefix) && !isCommonRoute) {
      console.warn(
        `[RoleGuard] Unauthorized access to ${pathname} by role ${role}. Redirecting to ${allowedPrefix}/dashboard`,
      );
      router.replace(`${allowedPrefix}/dashboard`);
    }
  }, [currentRole, pathname, router]);

  if (!currentRole) return <>{children}</>;

  return <>{children}</>;
}
