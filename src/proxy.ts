import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get session cookie
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/about", "/contact", "/services", "/pricing", "/blog", "/faq", "/resources"];
    const authRoutes = ["/signup", "/login"];

    // Allow public routes
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
        return NextResponse.next();
    }

    // Allow auth routes
    if (authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Protect dashboard routes - require authentication
    if (pathname.startsWith("/(dashboard)") || pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") || pathname.startsWith("/student") ||
        pathname.startsWith("/parent")) {

        if (!sessionToken) {
            // Redirect to login if not authenticated
            const url = request.nextUrl.clone();
            url.pathname = "/signup";
            return NextResponse.redirect(url);
        }
    }

    // TODO: Add role-based route protection
    // This will require fetching the session from Better Auth API
    // For now, we'll handle role-based redirects in the dashboard layout

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
