"use client";

import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { TopHeader } from "@/components/layout/TopHeader";
import { SidebarProvider, useSidebar } from "@/components/layout/SidebarContext";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
    children: React.ReactNode;
}

function AppLayoutContent({ children }: AppLayoutProps) {
    const { collapsed, toggleCollapse } = useSidebar();

    return (
        <div className="min-h-screen bg-background flex">
            {/* Desktop Sidebar */}
            <div className={cn("hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-300", collapsed ? "w-[70px]" : "w-64")}>
                <SidebarNavigation collapsed={collapsed} toggleCollapse={toggleCollapse} />
            </div>

            {/* Main Content Area */}
            <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-300", collapsed ? "md:pl-[70px]" : "md:pl-64")}>
                <TopHeader />
                <main className="flex-1 p-6 overflow-y-auto bg-muted/20 dark:bg-background">
                    <div className="container mx-auto max-w-7xl animate-in fade-in zoom-in duration-300">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <SidebarProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </SidebarProvider>
    );
}

