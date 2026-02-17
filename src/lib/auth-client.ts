"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { SessionUser } from "./auth-types";

/** Enriched session type with LMS role/tenant */
export interface EnrichedSession {
  user: SessionUser;
  session: { id: string; userId: string; expiresAt: Date };
}

async function fetchSession(): Promise<EnrichedSession | null> {
  const res = await fetch("/api/auth/session", { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.user) return null;
  return data as EnrichedSession;
}

/**
 * Client-side session hook. Relies on proxy-refreshed cookies.
 * Fetches session from server API (single source of truth).
 */
export function useSession() {
  const supabase = createClient();
  const [session, setSession] = useState<EnrichedSession | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const data = await fetchSession();
        if (cancelled) return;
        setSession(data);
      } catch (err) {
        if (cancelled) return;
        console.warn("[useSession] Session fetch failed:", err);
        setSession(null);
      } finally {
        if (!cancelled) setIsPending(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchSession().then((data) => setSession(data));
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return { data: session, isPending };
}

/** Better-auth compatible signIn API */
export const signIn = {
  email: async (opts: {
    email: string;
    password: string;
    rememberMe?: boolean;
    callbackURL?: string;
    fetchOptions?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { message?: string } }) => void;
      onSuccess?: () => void;
    };
  }) => {
    opts.fetchOptions?.onRequest?.();
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: opts.email,
        password: opts.password,
      });
      if (error) {
        opts.fetchOptions?.onError?.({ error: { message: error.message } });
        return;
      }
      opts.fetchOptions?.onSuccess?.();
      if (opts.callbackURL) {
        // Defer redirect to let Supabase finish saving the session (avoids AbortError from locks.ts)
        setTimeout(() => {
          window.location.href = opts.callbackURL!;
        }, 100);
      }
    } catch (err) {
      opts.fetchOptions?.onError?.({
        error: { message: err instanceof Error ? err.message : "Sign in failed" },
      });
    } finally {
      opts.fetchOptions?.onResponse?.();
    }
  },
  social: async (opts: {
    provider: "google";
    callbackURL?: string;
    fetchOptions?: { onRequest?: () => void; onResponse?: () => void };
  }) => {
    opts.fetchOptions?.onRequest?.();
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(opts.callbackURL || "/dashboard")}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: opts.provider,
      options: { redirectTo },
    });
    opts.fetchOptions?.onResponse?.();
    if (error) return;
    // OAuth redirects to callback, which exchanges code and redirects to next
  },
};

/** Better-auth compatible signUp API */
export const signUp = {
  email: async (opts: {
    email: string;
    password: string;
    name?: string;
    image?: string;
    callbackURL?: string;
    fetchOptions?: {
      onRequest?: () => void;
      onResponse?: () => void;
      onError?: (ctx: { error: { code?: string; message?: string } }) => void;
      onSuccess?: (ctx?: { session: unknown }) => void;
    };
  }) => {
    opts.fetchOptions?.onRequest?.();
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: opts.email,
      password: opts.password,
      options: {
        data: { name: opts.name, avatar_url: opts.image },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(opts.callbackURL || "/onboarding")}`,
      },
    });
    opts.fetchOptions?.onResponse?.();
    if (error) {
      opts.fetchOptions?.onError?.({
        error: {
          code: error.message.includes("already") ? "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" : undefined,
          message: error.message,
        },
      });
      return;
    }
    opts.fetchOptions?.onSuccess?.({ session: data.session });
    // Only redirect if we have a session (email confirmation disabled).
    // If session is null, user must confirm email first - they'll land on /onboarding via the callback.
    if (data.session && opts.callbackURL) {
      window.location.href = opts.callbackURL;
    }
  },
};

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}

export type { SessionUser };
