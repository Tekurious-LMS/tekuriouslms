"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import SignUp from "./sign-up";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="px-6 h-16 flex items-center border-b bg-background">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Logo width={140} />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <SignUp />
      </main>

      <footer className="py-4 text-center text-sm text-muted-foreground border-t">
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Log in
          </Link>
        </p>
      </footer>
    </div>
  );
}
