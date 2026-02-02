"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";

export function RoleGuard({ children }: { children: React.ReactNode }) {
    const { currentRole } = useTenant();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!currentRole) {
            // Allow initial load or public pages if this guard is strictly for dashboard
            // But if currentRole is missing inside dashboard, it might mean context isn't ready or user not logged in
            // Assuming protected layout handles basic auth, we focus on role mismatch here.
            return;
        }

        const role = currentRole.toLowerCase();

        // Define allowed prefixes for each role
        const allowedPrefixes: Record<string, string> = {
            student: "/student",
            teacher: "/teacher",
            admin: "/admin",
            parent: "/parent",
        };

        const allowedPrefix = allowedPrefixes[role];

        // If the current path doesn't start with the allowed prefix (and isn't a shared route like /settings if you have one)
        // Check strict isolation:

        // Shared routes could be explicitly allowed if needed. For now, strict isolation as requested.
        const isCommonRoute = pathname === "/settings" || pathname === "/profile";

        if (!pathname.startsWith(allowedPrefix) && !isCommonRoute) {
            // Redirect to their dashboard
            console.warn(`[RoleGuard] Unauthorized access to ${pathname} by role ${role}. Redirecting to ${allowedPrefix}/dashboard`);
            router.replace(`${allowedPrefix}/dashboard`);
        } else {
            setIsAuthorized(true);
        }

    }, [currentRole, pathname, router]);

    // Optimize visual stability - maybe show a loader if checking?
    // For now, render children but relying on the effect to redirect quickly.
    // To prevent "flash of unauthorized content", we could return null until authorized.

    if (!currentRole) return <>{children}</>; // Let auth middleware handle login check, or context render default

    return <>{children}</>;
}
