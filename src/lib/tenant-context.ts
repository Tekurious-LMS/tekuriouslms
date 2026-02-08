import { AsyncLocalStorage } from "async_hooks";
import { LmsUser } from "@prisma/client";
import { Role } from "./rbac-types";

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  tenantConfig?: {
    logo?: string | null;
    theme?: Record<string, unknown> | null;
  };
  user?: LmsUser;
  userRole?: Role;
}

/**
 * AsyncLocalStorage for request-scoped tenant context
 * This ensures tenant context is isolated per request
 */
export const tenantContextStorage = new AsyncLocalStorage<TenantContext>();

/**
 * Get current tenant context (may be undefined)
 * Use this when tenant context is optional
 */
export function getTenantContext(): TenantContext | undefined {
  return tenantContextStorage.getStore();
}

/**
 * Require tenant context (throws if missing)
 * Use this when tenant context is mandatory
 */
export function requireTenantContext(): TenantContext {
  const context = tenantContextStorage.getStore();
  if (!context) {
    throw new TenantContextMissingError(
      "Tenant context is required but not available. Ensure request is running within tenant context.",
    );
  }
  return context;
}

/**
 * Run a function within tenant context
 * This is the primary way to inject tenant context into a request
 */
export function runWithTenantContext<T>(
  context: TenantContext,
  fn: () => T | Promise<T>,
): Promise<T> {
  return tenantContextStorage.run(context, async () => {
    const result = fn();
    return result instanceof Promise ? result : Promise.resolve(result);
  });
}

/**
 * Error thrown when tenant context is required but missing
 */
export class TenantContextMissingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantContextMissingError";
  }
}
