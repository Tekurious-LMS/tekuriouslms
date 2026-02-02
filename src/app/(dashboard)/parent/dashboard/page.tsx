import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
    User,
    Bell,
    FileText,
    Calendar,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock,
    Award,
    TrendingUp,
    Cuboid
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ARParentSection } from "@/components/placeholders/ARParentSection";

export default async function ParentDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || (session.user as any).role?.toLowerCase() !== "parent") {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to Parent Dashboard</div>;
    }

    const userName = session.user.name || "Parent";

    // Mock data - in production this would fetch the linked student's data
    const student = {
        name: "Alex Smith",
        grade: "Grade 10",
        section: "A",
        rollNo: "24",
        attendance: 94,
        status: "Active"
    };

    const courseProgress = [
        { id: 1, name: "Advanced Physics", teacher: "Ms. Sarah Jones", completion: 65, lastActive: "2 hours ago" },
        { id: 2, name: "Mathematics", teacher: "Mr. David Brown", completion: 78, lastActive: "Yesterday" },
        { id: 3, name: "World History", teacher: "Mrs. Emily White", completion: 45, lastActive: "3 days ago" },
    ];

    const recentAssessments = [
        { id: 1, name: "Newton's Laws Quiz", course: "Advanced Physics", score: "18/20", grade: "A", status: "Completed" },
        { id: 2, name: "Algebra Mid-Term", course: "Mathematics", score: "85/100", grade: "B+", status: "Completed" },
        { id: 3, name: "History Essay", course: "World History", score: "-", grade: "-", status: "Pending" },
    ];

    const notifications = [
        { id: 1, title: "Report Card Released", message: "Mid-term report cards are now available.", time: "2 hours ago", type: "academic" },
        { id: 2, title: "Parent-Teacher Meeting", message: "Scheduled for Feb 24th at 10:00 AM.", time: "1 day ago", type: "event" },
        { id: 3, title: "Assignment Due", message: "History project is due on Friday.", time: "2 days ago", type: "alert" },
    ];

    return (
        <div className="w-full min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Parent Portal
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Monitor your child's academic progress and stay updated.
                        </p>
                    </div>
                </div>

                {/* 1. LINKED STUDENT OVERVIEW */}
                <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Student Profile</CardTitle>
                                <CardDescription>Currently viewing progress for:</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {student.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-2 border-background shadow-xs">
                                {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">{student.name}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Badge variant="secondary" className="font-normal">
                                        {student.grade} - Section {student.section}
                                    </Badge>
                                    <span className="text-sm">• Roll No. {student.rollNo}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. ACADEMIC PROGRESS SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{student.attendance}%</span>
                                <span className="text-sm text-muted-foreground">overall</span>
                            </div>
                            <Progress value={student.attendance} className="h-2 mt-3" />
                        </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" />
                                Active Courses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">{courseProgress.length}</span>
                                <span className="text-sm text-muted-foreground">enrolled</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Across 3 subjects
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Award className="w-4 h-4 text-primary" />
                                Recent Grade
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold">A-</span>
                                <span className="text-sm text-muted-foreground">in Math</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                Mid-term assessment
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* 3. COURSE & LESSON STATUS */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Course Progress</h2>
                    {courseProgress.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {courseProgress.map((course) => (
                                <Card key={course.id} className="border-border hover:border-primary/50 transition-all hover:shadow-md">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg">{course.name}</CardTitle>
                                        <CardDescription>{course.teacher}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Completion</span>
                                                <span className="font-medium">{course.completion}%</span>
                                            </div>
                                            <Progress value={course.completion} className="h-2" />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            Last active: {course.lastActive}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <BookOpen className="h-10 w-10 text-muted-foreground mb-3" />
                                <h3 className="text-lg font-semibold mb-2">No active course enrollments</h3>
                                <p className="text-sm text-muted-foreground">Detailed progress will appear here once enrollment is active.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 4. ASSESSMENT PERFORMANCE */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Recent Assessments</h2>
                    <Card>
                        <CardContent className="p-0">
                            {recentAssessments.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Assessment</TableHead>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Grade</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentAssessments.map((assessment) => (
                                            <TableRow key={assessment.id}>
                                                <TableCell className="font-medium">{assessment.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{assessment.course}</TableCell>
                                                <TableCell>{assessment.score}</TableCell>
                                                <TableCell>
                                                    <Badge variant={assessment.grade.startsWith('A') ? "default" : "secondary"}>
                                                        {assessment.grade}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={`text-xs font-medium ${assessment.status === "Completed" ? "text-primary" : "text-muted-foreground"
                                                        }`}>
                                                        {assessment.status}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Award className="h-10 w-10 text-muted-foreground mb-3" />
                                    <h3 className="text-lg font-semibold mb-2">No recently graded assessments</h3>
                                    <p className="text-sm text-muted-foreground">Grades and scores will be listed here.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* 5. NOTIFICATIONS */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Notifications</h2>
                    {notifications.length > 0 ? (
                        <div className="grid gap-4">
                            {notifications.map((notification) => (
                                <Card key={notification.id} className="border-l-4 border-l-primary/20">
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="p-2 rounded-full bg-muted mt-1">
                                            {notification.type === 'academic' && <FileText className="w-4 h-4 text-primary" />}
                                            {notification.type === 'event' && <Calendar className="w-4 h-4 text-primary" />}
                                            {notification.type === 'alert' && <Bell className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-sm">{notification.title}</h4>
                                                <span className="text-xs text-muted-foreground">{notification.time}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                <Bell className="h-10 w-10 text-muted-foreground mb-3" />
                                <h3 className="text-lg font-semibold mb-2">No new notifications</h3>
                                <p className="text-sm text-muted-foreground">You're all caught up!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* 6. IMMERSIVE LEARNING PREVIEW (AR/VR) */}
                <ARParentSection />

            </div>
        </div>
    );
}
