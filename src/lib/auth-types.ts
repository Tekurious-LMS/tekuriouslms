// Type definitions for Better Auth session with custom fields
export interface SessionUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Custom LMS fields
  lmsUserId: string | null;
  role: string | null;
  // Multi-tenancy fields
  tenantId: string | null;
  tenantSlug: string | null;
  tenantName: string | null;
}

export interface ExtendedSession {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}
