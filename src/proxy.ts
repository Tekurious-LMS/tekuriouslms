import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Extract tenant slug from path-based URL
 * Pattern: /t/{slug}/...
 */
function extractTenantSlug(pathname: string): string | null {
  const match = pathname.match(/^\/t\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Check if route requires tenant resolution.
 * Only paths starting with /t/{slug}/ require tenant resolution.
 * Paths like /onboarding, /dashboard, /teacher/dashboard work without /t/ prefix.
 */
function requiresTenantResolution(pathname: string): boolean {
  return pathname.startsWith("/t/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run Supabase session refresh first (updates auth cookies)
  const { response, user } = await updateSession(request);

  // ========================================
  // TENANT RESOLUTION (BEFORE AUTH)
  // ========================================

  if (requiresTenantResolution(pathname)) {
    const tenantSlug = extractTenantSlug(pathname);

    if (!tenantSlug) {
      return new NextResponse(
        JSON.stringify({
          error: "Not Found",
          message: "Invalid URL format. Expected: /t/{tenant-slug}/...",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-tenant-slug", tenantSlug);

    const dashboardRoutePattern =
      /^\/t\/[^/]+\/(admin|teacher|student|parent)(\/|$)/;
    const isDashboardRoute = dashboardRoutePattern.test(pathname);

    if (isDashboardRoute && !user) {
      const signupUrl = new URL("/signup", request.url);
      return NextResponse.redirect(signupUrl);
    }

    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.getSetCookie?.().forEach((c) => res.headers.append("Set-Cookie", c));
    return res;
  }

  // ========================================
  // AUTH PROTECTION (FOR NON-TENANT ROUTES)
  // ========================================

  const dashboardRoutes = ["/admin", "/teacher", "/student", "/parent"];
  const isDashboardRoute = dashboardRoutes.some((route) =>
    pathname.includes(route),
  );

  if (isDashboardRoute && !user) {
    const signupUrl = new URL("/signup", request.url);
    return NextResponse.redirect(signupUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
