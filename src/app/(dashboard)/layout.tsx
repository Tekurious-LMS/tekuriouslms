import { AppLayout } from "@/components/layout/AppLayout";
import { RoleGuard } from "@/components/layout/RoleGuard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleGuard>
      <AppLayout>{children}</AppLayout>
    </RoleGuard>
  );
}
