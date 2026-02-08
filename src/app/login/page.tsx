"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import SignIn from "../signup/sign-in";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="px-6 h-16 flex items-center border-b bg-background">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Logo width={140} />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <SignIn />
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </footer>
    </div>
  );
}
