import { TopHeader } from "@/components/layout/TopHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopHeader />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-muted/20 dark:bg-background">
          <div className="container mx-auto max-w-7xl animate-in fade-in zoom-in duration-300">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
