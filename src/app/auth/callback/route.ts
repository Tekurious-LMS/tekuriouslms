/**
 * Supabase Auth callback route.
 * Handles OAuth redirects and email confirmation links.
 * Exchanges the auth code for a session and redirects to the intended destination.
 */
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[AUTH CALLBACK] exchangeCodeForSession error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/signup?error=${encodeURIComponent(error.message)}`,
      );
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
