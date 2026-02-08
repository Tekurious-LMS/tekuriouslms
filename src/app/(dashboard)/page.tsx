import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const role = (
    session.user as unknown as { role?: string }
  ).role?.toLowerCase();

  if (role === "student") redirect("/student/dashboard");
  if (role === "teacher") redirect("/teacher/dashboard");
  if (role === "admin") redirect("/admin/dashboard");
  if (role === "parent") redirect("/parent/dashboard");

  // Fallback if role is missing or unknown
  return (
    <div className="p-8 text-center">
      <h1 className="text-xl font-bold">Account Setup Incomplete</h1>
      <p className="text-muted-foreground">
        Please contact support to assign a role to your account.
      </p>
    </div>
  );
}
