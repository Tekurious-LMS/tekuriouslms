import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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
    const isDashboardRoute =
        pathname.startsWith("/(dashboard)") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/teacher") ||
        pathname.startsWith("/student") ||
        pathname.startsWith("/parent") ||
        pathname === "/dashboard";

    if (isDashboardRoute) {
        if (!sessionToken) {
            // Redirect to login if not authenticated
            const url = request.nextUrl.clone();
            url.pathname = "/signup";
            return NextResponse.redirect(url);
        }

        // Fetch session to check role
        // Note: In middleware we can't easily enable the full session check without making an API call
        // For better performance, we'll trust the session token exists for now
        // and let the page layouts handle the fine-grained role redirection
        // or we could decode the token if it were a JWT, but Better Auth uses opaque tokens by default

        // However, for strict role separation, we should consider fetching session here
        // But for this step, we will rely on the page-level checks we added to dashboard pages
        // to redirect back if role doesn't match.
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
