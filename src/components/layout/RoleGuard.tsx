"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";

const COMMON_ALLOWED_PREFIXES = [
  "/courses",
  "/assessments",
  "/analytics",
  "/notices",
  "/schedule",
  "/practice",
  "/profile",
  "/settings",
];

const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  admin: ["/admin", "/users", "/audit-logs", ...COMMON_ALLOWED_PREFIXES],
  teacher: ["/teacher", ...COMMON_ALLOWED_PREFIXES],
  student: ["/student", ...COMMON_ALLOWED_PREFIXES],
  parent: ["/parent", ...COMMON_ALLOWED_PREFIXES],
};

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { currentRole } = useTenant();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!currentRole) {
      return;
    }

    const role = currentRole.toLowerCase();
    const allowedPrefixes = ROLE_ALLOWED_PREFIXES[role] ?? [];
    const isAllowed = allowedPrefixes.some((prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
    const defaultPrefix =
      role === "admin"
        ? "/admin/dashboard"
        : role === "teacher"
          ? "/teacher/dashboard"
          : role === "student"
            ? "/student/dashboard"
            : "/parent/dashboard";

    if (!isAllowed) {
      console.warn(
        `[RoleGuard] Unauthorized access to ${pathname} by role ${role}. Redirecting to ${defaultPrefix}`,
      );
      router.replace(defaultPrefix);
    }
  }, [currentRole, pathname, router]);

  if (!currentRole) return <>{children}</>;

  return <>{children}</>;
}
