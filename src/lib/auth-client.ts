import { createAuthClient } from "better-auth/react";
import type { SessionUser } from "./auth-types";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;

// Export typed session hook
export type { SessionUser };
