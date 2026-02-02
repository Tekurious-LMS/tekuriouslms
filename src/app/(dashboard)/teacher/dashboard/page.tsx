import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { BookOpen, Users, BarChart, Plus, Cuboid, GraduationCap, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TeacherDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || (session.user as any).role?.toLowerCase() !== "teacher") {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to Teacher Dashboard</div>;
    }

    const userName = session.user.name || "Teacher";

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Teacher Portal
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage your courses, assessments, and track student progress.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button asChild variant="outline">
                            <Link href="/assessments/create">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                New Assessment
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/courses/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Course
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: BookOpen, label: "Active Courses", value: "3", color: "text-blue-500", bg: "bg-blue-500/10" },
                        { icon: Users, label: "Enrolled Students", value: "128", color: "text-green-500", bg: "bg-green-500/10" },
                        { icon: CheckCircle, label: "Assignments to Grade", value: "12", color: "text-orange-500", bg: "bg-orange-500/10" },
                        { icon: BarChart, label: "Avg. Class Score", value: "84%", color: "text-purple-500", bg: "bg-purple-500/10" },
                    ].map((stat, idx) => (
                        <Card key={idx} className="border-border/60 shadow-xs hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Course Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Courses</CardTitle>
                                <CardDescription>Overview of your currently published courses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { name: "Advanced Physics: Mechanics", students: 45, rating: 4.8 },
                                        { name: "Intro to Calculus", students: 38, rating: 4.6 },
                                        { name: "Organic Chemistry 101", students: 45, rating: 4.9 }
                                    ].map((course, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {course.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{course.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{course.students} Students • {course.rating} ★</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/courses/${i}`}>Manage</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        {/* AR/VR Create Placeholder */}
                        <Card className="border-dashed border-2 bg-muted/20">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">AR Studio</CardTitle>
                                    <Badge variant="secondary">Coming Soon</Badge>
                                </div>
                                <CardDescription>Create immersive 3D lessons</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-center py-6">
                                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                    <Cuboid className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    The AR/VR content creator studio is currently in development. You will be able to build interactive models soon.
                                </p>
                                <Button disabled className="w-full">Create AR Lesson</Button>
                            </CardContent>
                        </Card>

                        {/* Recent Activity Mini */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Submissions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { student: "Alex Chen", task: "Physics Lab Report", time: "10m ago" },
                                    { student: "Sarah Jones", task: "Calculus Quiz", time: "1h ago" },
                                    { student: "Mike Ross", task: "Chem Assignment", time: "3h ago" }
                                ].map((sub, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-medium">{sub.student}</p>
                                            <p className="text-muted-foreground text-xs">{sub.task}</p>
                                        </div>
                                        <span className="text-muted-foreground text-xs">{sub.time}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
