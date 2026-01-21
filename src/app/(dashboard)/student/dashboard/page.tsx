import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, TrendingUp, Clock, Award, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">
                    Track your progress, continue learning, and ace your exams
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">6</div>
                        <p className="text-xs text-muted-foreground">Active courses</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">87%</div>
                        <p className="text-xs text-muted-foreground">+5% this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">Badges earned</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Continue Learning</CardTitle>
                        <CardDescription>
                            Pick up where you left off
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { course: "Physics - Chapter 5: Motion", progress: 65 },
                                { course: "Mathematics - Calculus Basics", progress: 42 },
                                { course: "Chemistry - Organic Chemistry", progress: 78 },
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">{item.course}</p>
                                        <p className="text-sm text-muted-foreground">{item.progress}%</p>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button asChild className="w-full">
                                <Link href="/learn">Go to Learning</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Upcoming Assessments</CardTitle>
                        <CardDescription>Tests and quizzes this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { test: "Physics Mid-term", date: "Tomorrow" },
                                { test: "Math Quiz - Calculus", date: "In 3 days" },
                                { test: "Chemistry Lab Test", date: "Friday" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.test}</p>
                                        <p className="text-xs text-muted-foreground">{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/practice">Practice Now</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
