import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Users, GraduationCap, Building2, Activity, Settings, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || (session.user as any).role?.toLowerCase() !== "admin") {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to Admin Dashboard</div>;
    }

    const userName = session.user.name || "Admin";

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Admin Console
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Overview of organization health, users, and system settings.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/users/invite">
                            <Users className="mr-2 h-4 w-4" />
                            Invite Users
                        </Link>
                    </Button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Users, label: "Total Users", value: "2,450", color: "text-blue-500", bg: "bg-blue-500/10", change: "+12% this month" },
                        { icon: GraduationCap, label: "Active Courses", value: "86", color: "text-green-500", bg: "bg-green-500/10", change: "+5 new courses" },
                        { icon: Building2, label: "Departments", value: "12", color: "text-purple-500", bg: "bg-purple-500/10", change: "Stable" },
                        { icon: Activity, label: "System Uptime", value: "99.9%", color: "text-emerald-500", bg: "bg-emerald-500/10", change: "Last 30 days" },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-border/60 shadow-xs hover:shadow-md transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <Badge variant="outline" className="text-xs">{stat.change}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Configuration & Management */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Management */}
                    <Link href="/users" className="group block">
                        <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    User Management
                                </CardTitle>
                                <CardDescription>Manage students, teachers, and staff.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Add/Remove Users</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Manage Roles</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Reset Passwords</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Academic Structure */}
                    <Link href="/academic-structure" className="group block">
                        <Card className="h-full hover:border-primary/50 transition-all cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Academic Structure
                                </CardTitle>
                                <CardDescription>Configure classes, subjects, and periods.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Curriculum Management</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Class Schedules</li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Department Settings</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* AR Analytics Placeholder */}
                    <Card className="h-full border-dashed opacity-80">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                                    <TrendingUp className="w-5 h-5" />
                                    AR/VR Analytics
                                </CardTitle>
                                <Badge variant="secondary">Coming Soon</Badge>
                            </div>
                            <CardDescription>Usage stats for immersive content.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-32">
                            <p className="text-sm text-muted-foreground text-center">
                                Detailed analytics for AR/VR session engagement will appear here.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
