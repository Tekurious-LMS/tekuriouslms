import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Extract tenant slug from path-based URL
 * Pattern: /t/{slug}/...
 */
function extractTenantSlug(pathname: string): string | null {
    const match = pathname.match(/^\/t\/([^\/]+)/);
    return match ? match[1] : null;
}

/**
 * Check if route requires tenant resolution
 */
function requiresTenantResolution(pathname: string): boolean {
    // Public routes
    const publicRoutes = ["/", "/about", "/contact", "/services", "/pricing", "/blog", "/faq", "/resources"];
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return false;
    }

    // Auth routes
    const authRoutes = ["/signup", "/login"];
    if (authRoutes.some(route => pathname.startsWith(route))) {
        return false;
    }

    // Auth API routes
    if (pathname.startsWith("/api/auth")) {
        return false;
    }

    // Static files
    if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/)) {
        return false;
    }

    return true;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ========================================
    // TENANT RESOLUTION (BEFORE AUTH)
    // ========================================

    // Check if this route requires tenant resolution
    if (requiresTenantResolution(pathname)) {
        const tenantSlug = extractTenantSlug(pathname);

        if (!tenantSlug) {
            // No tenant slug in URL - this is an error for tenant-required routes
            return new NextResponse(
                JSON.stringify({
                    error: "Not Found",
                    message: "Invalid URL format. Expected: /t/{tenant-slug}/...",
                }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        // Store tenant slug in request headers for downstream use
        // Note: We don't validate against database here (Edge Runtime limitation)
        // Validation happens in API routes and page handlers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-tenant-slug", tenantSlug);

        // Continue to auth protection below instead of returning early
        // This ensures tenant-scoped dashboard routes are also auth-protected

        // ========================================
        // AUTH PROTECTION (AFTER TENANT)
        // ========================================

        // Protected dashboard routes require authentication
        const dashboardRoutes = ["/admin", "/teacher", "/student", "/parent"];
        const isDashboardRoute = dashboardRoutes.some(route => pathname.includes(route));

        if (isDashboardRoute) {
            // Check for session token
            const sessionToken = request.cookies.get("better-auth.session_token");

            if (!sessionToken) {
                // No session - redirect to signup
                const signupUrl = new URL("/signup", request.url);
                return NextResponse.redirect(signupUrl);
            }
        }

        // Return with tenant headers set
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    // ========================================
    // AUTH PROTECTION (FOR NON-TENANT ROUTES)
    // ========================================

    // Protected dashboard routes require authentication
    const dashboardRoutes = ["/admin", "/teacher", "/student", "/parent"];
    const isDashboardRoute = dashboardRoutes.some(route => pathname.includes(route));

    if (isDashboardRoute) {
        // Check for session token
        const sessionToken = request.cookies.get("better-auth.session_token");

        if (!sessionToken) {
            // No session - redirect to signup
            const signupUrl = new URL("/signup", request.url);
            return NextResponse.redirect(signupUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
