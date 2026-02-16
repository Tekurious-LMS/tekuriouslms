"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-types";

interface TenantContextType {
  currentUser: SessionUser | null;
  currentRole: string | null;
  currentSchool: {
    id: string;
    name: string;
  } | null;
  currentTenant: {
    id: string;
    name: string;
  } | null;
  currentOrganization: {
    id: string;
    name: string;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();

  const user = session?.user as SessionUser | undefined;

  const contextValue: TenantContextType = {
    currentUser: user || null,
    currentRole: user?.role || null,
    // Keep currentSchool for backward compatibility (alias to tenant)
    currentSchool:
      user?.tenantId && user?.tenantName
        ? { id: user.tenantId, name: user.tenantName }
        : null,
    // Primary tenant fields (from new multi-tenant system)
    currentTenant:
      user?.tenantId && user?.tenantName
        ? { id: user.tenantId, name: user.tenantName }
        : null,
    currentOrganization:
      user?.tenantId && user?.tenantName
        ? { id: user.tenantId, name: user.tenantName }
        : null,
    isLoading: isPending,
    isAuthenticated: !!session,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
