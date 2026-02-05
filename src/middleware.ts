import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ------------------------------------------------------------------
    // 1. TENANT RESOLUTION (Subdomain)
    // ------------------------------------------------------------------
    const hostname = request.headers.get("host") || "";
    // Assume format: [slug].domain.com or [slug].localhost:3000
    // If just domain.com or localhost:3000, it's the root (landing page) or invalid depending on app logic.
    // For this implementation, we extract the first part if it has multiple parts (excluding port/TLD logic simplified).

    let tenantSlug = null;

    if (hostname.includes(".")) {
        const parts = hostname.split(".");
        // Basic check: if strictly 2 parts (e.g. "localhost:3000"), first part is NOT tenant unless strictly defined.
        // Usually defaults to "www" or empty.
        // Development hack: if localhost, treat query param or specific header as override, OR just assume "demo" if on localhost root?
        // Strict rule: "Extract tenant slug from subdomain".

        if (parts.length > 2) {
            tenantSlug = parts[0]; // school1.tekurious.com -> school1
        } else if (hostname.includes("localhost") && parts.length === 1) {
            // localhost:3000 -> no subdomain
        }
    }

    // ------------------------------------------------------------------
    // 2. TENANT GUARD
    // ------------------------------------------------------------------
    // If we are on a dashboard route, we MUST have a tenant.
    const isDashboardRoute =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/student") ||
        pathname.startsWith("/parent");

    if (isDashboardRoute && !tenantSlug) {
        // Option: Redirect to landing or 404
        return new NextResponse("Tenant Not Found (Subdomain Required)", { status: 404 });
    }

    // Prepare Response
    const response = NextResponse.next();

    if (tenantSlug) {
        // Attach to headers for downstream consumption
        response.headers.set("x-tenant-slug", tenantSlug);
    }

    // ------------------------------------------------------------------
    // 3. AUTHENTICATION (Better Auth)
    // ------------------------------------------------------------------
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/about", "/contact", "/services", "/pricing", "/blog", "/faq", "/resources"];
    const authRoutes = ["/signup", "/login"];

    // Allow public routes
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return response;
    }

    // Allow auth routes
    if (authRoutes.some(route => pathname.startsWith(route))) {
        return response;
    }

    if (isDashboardRoute) {
        if (!sessionToken) {
            const url = request.nextUrl.clone();
            url.pathname = "/signup"; // Or login
            return NextResponse.redirect(url);
        }
        // Strict Role/Tenant checks would happen in Layout/Page or via strict API calls
    }

    return response;
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
