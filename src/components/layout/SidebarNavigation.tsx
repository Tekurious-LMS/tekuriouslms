"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  // Calendar,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings,
  Users,
  LogOut,
  BellRing,
  // ChevronLeft,
  // ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Cuboid,
  Activity,
  UserCheck,
  ClipboardList,
  Shield,
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

interface MenuRoute {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  disabled?: boolean;
  badge?: string;
}

export function SidebarNavigation({
  mobile,
  collapsed,
  toggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, currentSchool } = useTenant();
  const router = useRouter();

  // Normalize role for comparison and path generation
  const normalizedRole = currentRole
    ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1).toLowerCase()
    : "";

  // Define role-specific menus strictly
  const menuItems = {
    Student: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/student/dashboard" },
      {
        label: "My Courses",
        icon: BookOpen,
        href: "/student/courses",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Assessments",
        icon: GraduationCap,
        href: "/student/assessments",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Progress",
        icon: Activity,
        href: "/student/progress",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Immersive Learning",
        icon: Cuboid,
        href: "#",
        disabled: true,
        badge: "Phase 2",
      },
    ],
    Teacher: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/teacher/dashboard" },
      {
        label: "My Courses",
        icon: BookOpen,
        href: "/teacher/courses",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Lessons",
        icon: FileText,
        href: "/teacher/lessons",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Assessments",
        icon: GraduationCap,
        href: "/teacher/assessments",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Class Progress",
        icon: BarChart3,
        href: "/teacher/progress",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Immersive Learning",
        icon: Cuboid,
        href: "#",
        disabled: true,
        badge: "Phase 2",
      },
    ],
    Admin: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
      {
        label: "Users",
        icon: Users,
        href: "/users",
        disabled: true,
        badge: "Soon",
      },
      { label: "Academic Structure", icon: Layers, href: "/admin/structure" },
      {
        label: "Teacher Assignment",
        icon: UserCheck,
        href: "/admin/assignments",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Reports",
        icon: ClipboardList,
        href: "/admin/reports",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Audit Logs",
        icon: Shield,
        href: "/audit-logs",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Immersive Analytics",
        icon: BarChart3,
        href: "#",
        disabled: true,
        badge: "Phase 2",
      },
    ],
    Parent: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/parent/dashboard" },
      {
        label: "Student Progress",
        icon: Activity,
        href: "/parent/progress",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Assessments",
        icon: GraduationCap,
        href: "/parent/assessments",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Notifications",
        icon: BellRing,
        href: "/parent/notifications",
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Immersive Preview",
        icon: Cuboid,
        href: "#",
        disabled: true,
        badge: "Phase 2",
      },
    ],
  };

  // Define valid role types
  type ValidRole = "Student" | "Teacher" | "Admin" | "Parent";

  // Select menu based on role, default to empty
  const currentMenu =
    normalizedRole && normalizedRole in menuItems
      ? menuItems[normalizedRole as ValidRole]
      : [];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
        mobile ? "w-full" : collapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center h-16 border-b border-sidebar-border",
          collapsed ? "justify-center px-0" : "px-6 justify-between",
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center",
          )}
        >
          {collapsed ? (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
              TL
            </div>
          ) : (
            <Logo />
          )}
        </Link>
        {!mobile && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 text-sidebar-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!mobile && collapsed && (
        <div className="flex justify-center py-4 border-b border-sidebar-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="h-8 w-8 text-sidebar-foreground"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* School Name Display */}
      {!collapsed && currentSchool && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            School
          </p>
          <p className="text-sm font-medium text-sidebar-foreground truncate">
            {currentSchool.name}
          </p>
          {currentRole && (
            <span className="inline-flex mt-1 items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {normalizedRole}
            </span>
          )}
        </div>
      )}

      <div className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Main Menu
          </div>
        )}

        {currentMenu.map((route: MenuRoute) => {
          const isActive = pathname === route.href;
          if (route.disabled) {
            return (
              <div
                key={route.label}
                className={cn(
                  "group flex items-center px-3 py-2.5 mx-2 text-sm font-medium rounded-md transition-colors text-muted-foreground/50 cursor-not-allowed",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? route.label : undefined}
              >
                <route.icon
                  className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-3")}
                />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{route.label}</span>
                    {route.badge && (
                      <span className="ml-2 text-[10px] uppercase bg-muted text-muted-foreground px-1.5 py-0.5 rounded-sm">
                        {collapsed ? "..." : "Soon"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center px-3 py-2.5 mx-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
              title={collapsed ? route.label : undefined}
            >
              <route.icon
                className={cn(
                  "h-5 w-5",
                  collapsed ? "mr-0" : "mr-3",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-primary",
                )}
              />
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
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings
            className={cn(
              "h-5 w-5",
              collapsed ? "mr-0" : "mr-3",
              pathname === "/settings"
                ? "text-primary"
                : "text-muted-foreground group-hover:text-primary",
            )}
          />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "justify-center px-0",
          )}
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
