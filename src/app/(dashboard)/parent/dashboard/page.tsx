import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { User, Bell, FileText, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ParentDashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || (session.user as any).role?.toLowerCase() !== "parent") {
        return <div className="p-8 text-center text-muted-foreground">Unauthorized access to Parent Dashboard</div>;
    }

    const userName = session.user.name || "Parent";

    return (
        <div className="w-full min-h-screen bg-linear-to-br from-primary/5 via-background to-secondary/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Parent Portal
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Monitor your child's academic progress and stay updated.
                        </p>
                    </div>
                    <Button variant="outline" size="icon">
                        <Bell className="h-5 w-5" />
                    </Button>
                </div>

                {/* Child Overview */}
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Student Profile</CardTitle>
                                <CardDescription>Current enrollment information</CardDescription>
                            </div>
                            <Badge>Active</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                SC
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Student Child</h3>
                                <p className="text-sm text-muted-foreground">Class 10-A • Roll No. 24</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">94%</div>
                            <p className="text-xs text-muted-foreground mt-1 text-green-600">Present 4/5 days this week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Assignments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground mt-1">Due within 3 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Grade</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">A-</div>
                            <p className="text-xs text-muted-foreground mt-1">Mathematics Mid-Term</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications & Activity */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Recent Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    { title: "Mid-Term Report Card", date: "Jan 15, 2026", type: "Report" },
                                    { title: "Physics Lab Evaluation", date: "Jan 10, 2026", type: "Grade" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center justify-between p-3 rounded-md bg-muted/40">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{item.title}</span>
                                            <span className="text-xs text-muted-foreground">{item.date}</span>
                                        </div>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Upcoming Events
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {[
                                    { title: "Parent-Teacher Meeting", date: "Feb 05, 2026", time: "10:00 AM" },
                                    { title: "Science Fair", date: "Feb 20, 2026", time: "09:00 AM" }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 p-3 rounded-md border-l-2 border-primary bg-muted/40">
                                        <div className="flex flex-col items-center justify-center p-2 bg-background rounded-md shadow-sm w-12 text-center">
                                            <span className="text-xs font-bold uppercase text-muted-foreground">{item.date.split(" ")[0]}</span>
                                            <span className="font-bold">{item.date.split(" ")[1].replace(",", "")}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm block">{item.title}</span>
                                            <span className="text-xs text-muted-foreground">{item.time}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
