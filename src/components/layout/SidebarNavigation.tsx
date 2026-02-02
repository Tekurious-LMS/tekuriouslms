"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    BookOpen,
    Calendar,
    GraduationCap,
    LayoutDashboard,
    Layers,
    Settings,
    Users,
    LogOut,
    BellRing,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { useTenant } from "@/contexts/TenantContext";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarProps {
    mobile?: boolean;
    collapsed?: boolean;
    toggleCollapse?: () => void;
}

export function SidebarNavigation({ mobile, collapsed, toggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const { currentRole, currentSchool } = useTenant();
    const router = useRouter();

    // Normalize role for comparison and path generation
    const normalizedRole = currentRole ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1).toLowerCase() : "";

    // Get role-specific dashboard path
    const getDashboardPath = () => {
        if (!normalizedRole) return "/";
        return `/${normalizedRole.toLowerCase()}/dashboard`;
    };

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: getDashboardPath(),
            roles: ["Admin", "Teacher", "Student", "Parent"],
        },
        {
            label: "User Management",
            icon: Users,
            href: "/users",
            roles: ["Admin"],
        },
        {
            label: "Academic Structure",
            icon: Layers,
            href: "/academic-structure",
            roles: ["Admin"],
        },
        {
            label: "Courses",
            icon: BookOpen,
            href: "/courses",
            roles: ["Admin", "Teacher", "Student"],
        },
        {
            label: "Assessments",
            icon: GraduationCap,
            href: "/assessments",
            roles: ["Admin", "Teacher"],
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/analytics",
            roles: ["Admin", "Teacher", "Student"],
        },
        {
            label: "Schedule",
            icon: Calendar,
            href: "/schedule",
            roles: ["Admin", "Teacher", "Student"],
        },
        {
            label: "Notices",
            icon: BellRing,
            href: "/notices",
            roles: ["Admin", "Teacher", "Student"],
        },
        {
            label: "Practice",
            icon: BookOpen,
            href: "/practice",
            roles: ["Student"],
        },
        {
            label: "AR/VR Learning (Coming Soon)",
            icon: Layers,
            href: "#",
            roles: ["Admin", "Teacher", "Student"],
            disabled: true,
        },
        {
            label: "AI Insights (Coming Soon)",
            icon: BarChart3,
            href: "#",
            roles: ["Admin", "Teacher"],
            disabled: true,
        },
        {
            label: "Marketplace (Coming Soon)",
            icon: LayoutDashboard,
            href: "#",
            roles: ["Admin"],
            disabled: true,
        },
    ];

    const filteredRoutes = routes.filter((route) =>
        normalizedRole && route.roles.includes(normalizedRole)
    );

    return (
        <div className={cn("flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300", mobile ? "w-full" : (collapsed ? "w-[70px]" : "w-64"))}>
            <div className={cn("flex items-center h-16 border-b border-sidebar-border", collapsed ? "justify-center px-0" : "px-6 justify-between")}>
                <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
                    {collapsed ? (
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
                            TL
                        </div>
                    ) : (
                        <Logo />
                    )}
                </Link>
                {!mobile && !collapsed && (
                    <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8 text-sidebar-foreground">
                        <PanelLeftClose className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {!mobile && collapsed && (
                <div className="flex justify-center py-4 border-b border-sidebar-border">
                    <Button variant="ghost" size="icon" onClick={toggleCollapse} className="h-8 w-8 text-sidebar-foreground">
                        <PanelLeftOpen className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* School Name Display */}
            {!collapsed && currentSchool && (
                <div className="px-4 py-3 border-b border-sidebar-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">School</p>
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{currentSchool.name}</p>
                </div>
            )}

            <div className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                {!collapsed && (
                    <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Main Menu
                    </div>
                )}

                {filteredRoutes.map((route) => {
                    if ((route as any).disabled) {
                        return (
                            <div
                                key={route.label}
                                className={cn(
                                    "group flex items-center px-3 py-2.5 mx-2 text-sm font-medium rounded-md transition-colors text-muted-foreground/50 cursor-not-allowed",
                                    collapsed && "justify-center px-2"
                                )}
                                title={collapsed ? route.label : undefined}
                            >
                                <route.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                                {!collapsed && <span>{route.label}</span>}
                            </div>
                        );
                    }
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex items-center px-3 py-2.5 mx-2 text-sm font-medium rounded-md transition-colors",
                                pathname === route.href
                                    ? "bg-sidebar-accent text-sidebar-primary"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                                collapsed && "justify-center px-2"
                            )}
                            title={collapsed ? route.label : undefined}
                        >
                            <route.icon className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3", pathname === route.href ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                            {!collapsed && <span>{route.label}</span>}
                        </Link>
                    );
                })}

                {!collapsed && (
                    <div className="mt-8 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Settings
                    </div>
                )}
                <Link
                    href="/settings"
                    className={cn(
                        "group flex items-center px-3 py-2.5 mx-2 text-sm font-medium rounded-md transition-colors",
                        pathname === "/settings"
                            ? "bg-sidebar-accent text-sidebar-primary"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? "Settings" : undefined}
                >
                    <Settings className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3", pathname === "/settings" ? "text-primary" : "text-muted-foreground group-hover:text-primary")} />
                    {!collapsed && <span>Settings</span>}
                </Link>
            </div>

            <div className="mt-auto p-4 border-t border-sidebar-border">
                <Button
                    variant="ghost"
                    className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground", collapsed && "justify-center px-0")}
                    onClick={async () => {
                        await signOut();
                        router.push("/");
                    }}
                >
                    <LogOut className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")} />
                    {!collapsed && "Logout"}
                </Button>
            </div>
        </div>
    );
}
