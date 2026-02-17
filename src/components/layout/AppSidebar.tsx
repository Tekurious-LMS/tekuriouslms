"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Settings,
  Users,
  LogOut,
  BellRing,
  FileText,
  Cuboid,
  Activity,
  UserCheck,
  ClipboardList,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useTenant } from "@/contexts/TenantContext";
import { signOut } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface MenuRoute {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  disabled?: boolean;
  badge?: string;
}

const MENU_ITEMS: Record<string, MenuRoute[]> = {
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
    { label: "Users", icon: Users, href: "/users" },
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
    { label: "Audit Logs", icon: Shield, href: "/audit-logs" },
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

type ValidRole = "Student" | "Teacher" | "Admin" | "Parent";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, currentSchool } = useTenant();

  const normalizedRole = currentRole
    ? currentRole.charAt(0).toUpperCase() + currentRole.slice(1).toLowerCase()
    : "";

  const currentMenu =
    normalizedRole && normalizedRole in MENU_ITEMS
      ? MENU_ITEMS[normalizedRole as ValidRole]
      : [];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-16 items-center gap-2 px-2">
          <div className="group-data-[collapsible=icon]:hidden">
            <Logo />
          </div>
        </div>
        {currentSchool && (
          <div className="px-2 pb-3 group-data-[collapsible=icon]:hidden">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              School
            </p>
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {currentSchool.name}
            </p>
            {currentRole && (
              <span className="mt-1 inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                {normalizedRole}
              </span>
            )}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {currentMenu.map((route) => {
                const isActive = pathname === route.href;
                if (route.disabled) {
                  return (
                    <SidebarMenuItem key={route.label}>
                      <SidebarMenuButton
                        disabled
                        tooltip={route.label}
                        className="cursor-not-allowed opacity-50"
                      >
                        <route.icon className="h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {route.label}
                        </span>
                        {route.badge && (
                          <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
                            Soon
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={route.label}
                    >
                      <Link href={route.href}>
                        <route.icon className="h-5 w-5" />
                        <span>{route.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/settings"}
                  tooltip="Settings"
                >
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">
                Logout
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
