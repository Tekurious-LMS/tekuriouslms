"use client";

import { Bell, Menu, Moon, Search, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarNavigation } from "./SidebarNavigation";

import { Logo } from "@/components/ui/Logo";

export function TopHeader() {
    const { setTheme, theme } = useTheme();
    const pathname = usePathname();

    // Simple breadcrumb logic
    const pathSegments = pathname.split("/").filter((segment) => segment);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        return { label: segment.charAt(0).toUpperCase() + segment.slice(1), href };
    });

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-2 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarNavigation mobile />
                    </SheetContent>
                </Sheet>
                <Logo />
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">
                    Home
                </Link>
                {breadcrumbs.map((crumb) => (
                    <div key={crumb.href} className="flex items-center gap-2">
                        <span>/</span>
                        <Link
                            href={crumb.href}
                            className="hover:text-foreground transition-colors font-medium text-foreground"
                        >
                            {crumb.label}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="ml-auto flex items-center gap-4">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search..."
                        className="h-9 w-64 rounded-md border border-input bg-transparent pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                        3
                    </Badge>
                    <span className="sr-only">Notifications</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/01.png" alt="@user" />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Alice Admin</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    alice@tekurious.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 font-medium">Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
