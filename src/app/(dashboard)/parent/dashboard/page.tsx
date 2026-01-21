import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, TrendingUp, Calendar, BookOpen, Award } from "lucide-react";

export default function ParentDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
                <p className="text-muted-foreground">
                    Monitor your child's progress and academic performance
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">+3% this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">96%</div>
                        <p className="text-xs text-muted-foreground">Excellent</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">Enrolled</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">This semester</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                        <CardDescription>
                            Subject-wise performance breakdown
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { subject: "Mathematics", score: 92, trend: "+5%" },
                                { subject: "Physics", score: 88, trend: "+2%" },
                                { subject: "Chemistry", score: 85, trend: "+3%" },
                                { subject: "Biology", score: 90, trend: "+7%" },
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{item.subject}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold">{item.score}%</p>
                                            <p className="text-xs text-green-600">{item.trend}</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${item.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates and achievements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { activity: "Completed Physics Chapter 5", time: "2 hours ago" },
                                { activity: "Scored 95% in Math Quiz", time: "Yesterday" },
                                { activity: "Earned 'Quick Learner' badge", time: "2 days ago" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.activity}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
