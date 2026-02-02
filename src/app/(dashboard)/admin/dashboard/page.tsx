import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    Users,
    GraduationCap,
    Building2,
    Activity,
    Settings,
    AlertCircle,
    TrendingUp,
    Plus,
    UserPlus,
    FileText,
    History,
    Shield,
    BarChart3,
    CheckCircle2,
    Calendar,
    ArrowRight,
    Cuboid
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ARAnalyticsSection } from "@/components/placeholders/ARAnalyticsSection";
import { AIInsightsSection } from "@/components/placeholders/AIInsightsSection";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || (session.user as any).role?.toLowerCase() !== "admin") {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to Admin Dashboard</div>;
    }

    const userName = session.user.name || "Admin";

    // Mock data - replace with actual API calls
    const stats = {
        totalStudents: 1240,
        totalTeachers: 86,
        activeCourses: 34,
        adoptionRate: 78
    };

    const auditLogs = [
        { id: 1, action: "Created new user", actor: "Admin User", role: "Admin", time: "2 mins ago" },
        { id: 2, action: "Published 'Advanced Physics'", actor: "Sarah Jones", role: "Teacher", time: "1 hour ago" },
        { id: 3, action: "Updated grade scaling", actor: "System", role: "System", time: "3 hours ago" },
        { id: 4, action: "Added new class: Grade 10-B", actor: "Admin User", role: "Admin", time: "5 hours ago" },
    ];

    const recentAssignments = [
        { id: 1, teacher: "Sarah Jones", type: "Class Assignment", target: "Grade 10-A", date: "Today" },
        { id: 2, teacher: "Michael Brown", type: "Course Assignment", target: "Intro to Biology", date: "Yesterday" },
        { id: 3, teacher: "Emily Davis", type: "Class Assignment", target: "Grade 11-C", date: "2 days ago" },
    ];

    const adoptionMetrics = [
        { label: "Student Enrollment", value: 85, total: 100 },
        { label: "Lesson Completion", value: 62, total: 100 },
        { label: "Assessment Participation", value: 78, total: 100 },
    ];

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* 1. ORGANIZATION OVERVIEW SECTION */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Admin Console
                            </h1>
                            <p className="text-muted-foreground mt-2 text-lg">
                                Overview of organization health, users, and system settings.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" disabled>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                            <Button disabled>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Invite Users
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                                    <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                                    <p className="text-2xl font-bold">{stats.activeCourses}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-primary/10">
                                    <Activity className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Adoption Rate</p>
                                    <p className="text-2xl font-bold">{stats.adoptionRate}%</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 2. USER MANAGEMENT SECTION */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">User Management</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <Card className="border-border opacity-70">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-xl bg-muted transition-colors">
                                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h3 className="font-semibold transition-colors">Invite Users</h3>
                                        <Badge variant="outline" className="text-[10px]">Soon</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Add new students, teachers, or staff
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border opacity-70">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-xl bg-muted transition-colors">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h3 className="font-semibold transition-colors">View Directory</h3>
                                        <Badge variant="outline" className="text-[10px]">Soon</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Manage roles and user status
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border opacity-70">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="p-4 rounded-xl bg-muted transition-colors">
                                    <Shield className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h3 className="font-semibold transition-colors">Access Control</h3>
                                        <Badge variant="outline" className="text-[10px]">Soon</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Review permissions and requests
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 3. ACADEMIC STRUCTURE SECTION */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Academic Structure</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Class Configuration</CardTitle>
                                <CardDescription>Manage grades, subjects, and curriculum mapping</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link href="/admin/structure" className="block">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="font-medium">Manage Structure</span>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </Link>
                                <div className="p-3 rounded-lg border border-dashed text-sm text-muted-foreground">
                                    <p>Configure Organization → Classes → Subjects hierarchy.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Department Settings</CardTitle>
                                <CardDescription>Configure department heads and resources</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Departments help organize teachers and subjects together.
                                </p>
                                <Button variant="outline" size="sm" disabled>
                                    Manage Departments (Phase 2)
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. TEACHER ASSIGNMENT SECTION */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Teacher Assignment</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Assignments</CardTitle>
                                    <CardDescription>Latest teacher allocations to classes and courses</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>Assignment Type</TableHead>
                                                <TableHead>Target</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentAssignments.map((assignment) => (
                                                <TableRow key={assignment.id}>
                                                    <TableCell className="font-medium">{assignment.teacher}</TableCell>
                                                    <TableCell>{assignment.type}</TableCell>
                                                    <TableCell>{assignment.target}</TableCell>
                                                    <TableCell className="text-muted-foreground">{assignment.date}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-4">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Assign</CardTitle>
                                    <CardDescription>Allocate resources</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Assign to Class
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Assign to Course
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* 5. PLATFORM ADOPTION METRICS */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Platform Adoption</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adoptionMetrics.map((metric, idx) => (
                            <Card key={idx}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {metric.label}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold mb-2">{metric.value}%</div>
                                    <Progress value={metric.value} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Based on active user data
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 6. AUDIT LOGS SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold">Audit Logs</h2>
                        <Button variant="ghost" size="sm" disabled>
                            View All
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Action</TableHead>
                                        <TableHead>Actor</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {auditLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.action}</TableCell>
                                            <TableCell>{log.actor}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">{log.role}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">{log.time}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* 7. IMMERSIVE LEARNING & AI INSIGHTS (PHASE-2) */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <ARAnalyticsSection />
                    <AIInsightsSection />
                </div>

            </div>
        </div>
    );
}
