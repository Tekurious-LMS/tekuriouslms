import { requireTenantContext } from "./tenant-context";
import { TenantMismatchError } from "./api-errors";

/**
 * Assert that tenant context exists
 * Throws TenantContextMissingError if context is missing
 */
export function assertTenantContext(): void {
    requireTenantContext();
}

/**
 * Assert that a tenantId matches the current tenant context
 * Throws TenantMismatchError if tenantId doesn't match
 */
export function assertTenantId(tenantId: string): void {
    const context = requireTenantContext();
    if (context.tenantId !== tenantId) {
        throw new TenantMismatchError(
            `Tenant ID mismatch: expected ${context.tenantId}, got ${tenantId}`
        );
    }
}


