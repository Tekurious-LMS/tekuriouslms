/**
 * API Error Classes for Tenant-Related Failures
 */

export class TenantNotFoundError extends Error {
  constructor(message: string = "Tenant not found") {
    super(message);
    this.name = "TenantNotFoundError";
  }
}

export class TenantMismatchError extends Error {
  constructor(
    message: string = "Tenant mismatch - user does not belong to this tenant",
  ) {
    super(message);
    this.name = "TenantMismatchError";
  }
}

export class TenantContextMissingError extends Error {
  constructor(message: string = "Tenant context is missing") {
    super(message);
    this.name = "TenantContextMissingError";
  }
}

/**
 * Handle tenant-related errors and return appropriate HTTP responses
 */
export function handleTenantError(error: Error): Response {
  if (error instanceof TenantNotFoundError) {
    return new Response(
      JSON.stringify({
        error: "Tenant not found",
        message: "The requested organization does not exist",
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (error instanceof TenantMismatchError) {
    return new Response(
      JSON.stringify({
        error: "Forbidden",
        message: "Access denied to this organization",
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (error instanceof TenantContextMissingError) {
    return new Response(
      JSON.stringify({
        error: "Bad Request",
        message: "Tenant context is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Generic server error for unknown errors
  console.error("[API] Unhandled error:", error);
  return new Response(
    JSON.stringify({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    },
  );
}
