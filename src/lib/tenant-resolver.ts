import { NextRequest } from "next/server";
import { prisma } from "./prisma";

export interface Tenant {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    themeConfig?: any | null;
}

/**
 * Extract tenant slug from request URL
 * Supports path-based tenant resolution: /t/{slug}/...
 */
export function extractTenantSlug(request: NextRequest): string | null {
    const { pathname } = request.nextUrl;

    // Path-based: /t/{slug}/...
    const pathMatch = pathname.match(/^\/t\/([^\/]+)/);
    if (pathMatch) {
        return pathMatch[1];
    }

    // TODO: Add subdomain-based resolution if needed in future
    // const host = request.headers.get("host");
    // if (host) {
    //   const subdomain = host.split(".")[0];
    //   if (subdomain && subdomain !== "www" && subdomain !== "localhost") {
    //     return subdomain;
    //   }
    // }

    return null;
}

/**
 * Validate tenant slug and fetch tenant from database
 * Returns null if tenant does not exist
 */
export async function validateTenant(tenantSlug: string): Promise<Tenant | null> {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { slug: tenantSlug },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                themeConfig: true,
            },
        });

        return tenant;
    } catch (error) {
        console.error("[TENANT] Error validating tenant:", error);
        return null;
    }
}

/**
 * Resolve tenant from request
 * Returns tenant object or null if tenant cannot be resolved
 */
export async function resolveTenantFromRequest(
    request: NextRequest
): Promise<Tenant | null> {
    const tenantSlug = extractTenantSlug(request);

    if (!tenantSlug) {
        return null;
    }

    return await validateTenant(tenantSlug);
}

/**
 * Check if a path requires tenant resolution
 * Public routes and auth routes don't require tenant context
 */
export function requiresTenantResolution(pathname: string): boolean {
    // Public routes that don't require tenant
    const publicRoutes = [
        "/",
        "/about",
        "/contact",
        "/services",
        "/pricing",
        "/blog",
        "/faq",
        "/resources",
    ];

    // Auth routes don't require tenant
    const authRoutes = ["/signup", "/login"];

    // API routes for auth don't require tenant
    const authApiRoutes = ["/api/auth"];

    // Check if path is public
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
        return false;
    }

    // Check if path is auth route
    if (authRoutes.some((route) => pathname.startsWith(route))) {
        return false;
    }

    // Check if path is auth API route
    if (authApiRoutes.some((route) => pathname.startsWith(route))) {
        return false;
    }

    // All other routes require tenant
    return true;
}
