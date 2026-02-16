"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Setting up your account...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function completeOnboarding() {
      try {
        // Get the pending role from sessionStorage
        const pendingRole = sessionStorage.getItem("pendingRole");

        if (!pendingRole) {
          // No pending role, redirect to dashboard (will use default or show error)
          setStatus("Redirecting to dashboard...");
          router.push("/dashboard");
          return;
        }

        setStatus(`Assigning role: ${pendingRole}...`);

        // Call the API to assign the role
        const response = await fetch("/api/onboarding/assign-role", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: pendingRole }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg =
            data.details || data.error || "Failed to assign role";
          throw new Error(errorMsg);
        }

        // Clear the pending role
        sessionStorage.removeItem("pendingRole");

        // Redirect to role-specific dashboard
        setStatus("Success! Redirecting...");
        router.push(data.redirectTo);
      } catch (err) {
        console.error("Onboarding error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        // Still try to redirect after error
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    }

    completeOnboarding();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Tekurious LMS!</CardTitle>
          <CardDescription>We&apos;re setting up your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {error ? (
            <div className="text-center">
              <p className="text-destructive mb-2">{error}</p>
              <p className="text-sm text-muted-foreground">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">{status}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
