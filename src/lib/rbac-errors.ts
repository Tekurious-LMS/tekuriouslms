/**
 * RBAC Error Types
 *
 * Standardized error types for RBAC failures
 */

/**
 * Base RBAC Error
 */
export class RBACError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 403,
    public readonly code: string = "RBAC_ERROR",
  ) {
    super(message);
    this.name = "RBACError";
  }
}

/**
 * Thrown when user is not authenticated
 */
export class UnauthenticatedError extends RBACError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHENTICATED");
    this.name = "UnauthenticatedError";
  }
}

/**
 * Thrown when user is authenticated but lacks permission
 */
export class ForbiddenError extends RBACError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

/**
 * Thrown when resource exists but user doesn't have access
 * Returns 404 to not leak resource existence
 */
export class ResourceNotFoundError extends RBACError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "ResourceNotFoundError";
  }
}

/**
 * Thrown when user's role is invalid or missing
 */
export class InvalidRoleError extends RBACError {
  constructor(message: string = "Invalid or missing role") {
    super(message, 403, "INVALID_ROLE");
    this.name = "InvalidRoleError";
  }
}

/**
 * Handle RBAC errors and return appropriate Response
 */
export function handleRBACError(error: unknown): Response {
  if (error instanceof RBACError) {
    return new Response(
      JSON.stringify({
        error: error.name,
        message: error.message,
        code: error.code,
      }),
      {
        status: error.statusCode,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  // Unknown error - return generic 500
  console.error("Unexpected RBAC error:", error);
  return new Response(
    JSON.stringify({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    },
  );
}
