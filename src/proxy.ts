import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

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
      const redirectRes = NextResponse.redirect(
        new URL("/signup", request.url),
      );
      response.cookies
        .getAll()
        .forEach(({ name, value }) => redirectRes.cookies.set(name, value));
      return redirectRes;
    }

    const res = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.cookies
      .getAll()
      .forEach(({ name, value }) => res.cookies.set(name, value));
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
    const redirectRes = NextResponse.redirect(new URL("/signup", request.url));
    response.cookies
      .getAll()
      .forEach(({ name, value }) => redirectRes.cookies.set(name, value));
    return redirectRes;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
