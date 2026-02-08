import { NextRequest, NextResponse } from "next/server";
import { TenantContext, runWithTenantContext } from "./tenant-context";
import { handleTenantError, TenantNotFoundError } from "./api-errors";
import { prisma } from "./prisma";

/**
 * Wrap an API route handler with tenant context
 * Validates tenant from x-tenant-slug header and injects it into context
 */
export async function withTenantContext(
    request: NextRequest,
    handler: (context: TenantContext) => Promise<Response>
): Promise<Response> {
    try {
        // Get tenant slug from header (set by middleware)
        const tenantSlug = request.headers.get("x-tenant-slug");

        if (!tenantSlug) {
            throw new TenantNotFoundError("Tenant slug not found in request headers");
        }

        // Validate tenant exists in database
        const tenant = await prisma.tenant.findUnique({
            where: { slug: tenantSlug },
        });

        if (!tenant) {
            throw new TenantNotFoundError(`Tenant not found: ${tenantSlug}`);
        }

        // Create tenant context
        const context: TenantContext = {
            tenantId: tenant.id,
            tenantSlug: tenant.slug,
            tenantName: tenant.name,
            tenantConfig: {
                logo: tenant.logo,
                theme: tenant.themeConfig,
            },
        };

        // Run handler within tenant context
        return await runWithTenantContext(context, () => handler(context));
    } catch (error) {
        if (error instanceof Error) {
            return handleTenantError(error);
        }
        throw error;
    }
}

/**
 * Create a tenant-aware API route handler
 * This is a higher-order function that wraps your handler with tenant context
 */
export function createTenantApiHandler(
    handler: (req: NextRequest, context: TenantContext) => Promise<Response>
): (req: NextRequest) => Promise<Response> {
    return async (req: NextRequest) => {
        return await withTenantContext(req, (context) => handler(req, context));
    };
}

/**
 * Helper to create JSON responses
 */
export function jsonResponse(data: any, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status: number = 400): Response {
    return jsonResponse({ error: message }, status);
}
