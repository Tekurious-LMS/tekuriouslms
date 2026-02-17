/**
 * Supabase session refresh for Next.js Proxy.
 * Per official Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * IMPORTANT: Use getClaims() to refresh tokens. Never use getSession() in proxy -
 * it doesn't revalidate. getClaims() validates JWT locally and refreshes when needed.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options ?? {}),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and getClaims().
  // Removing getClaims() may cause users to be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return { response: supabaseResponse, user };
}
