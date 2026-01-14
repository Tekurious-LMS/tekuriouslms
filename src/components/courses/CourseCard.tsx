"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Course, users } from "@/lib/mockData";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const teacher = users.find(u => u.id === course.teacherId);

    return (
        <Link href={`/courses/${course.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <div className="h-32 bg-slate-100 dark:bg-slate-800 relative rounded-t-lg flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-slate-400" />
                    <Badge className="absolute top-2 right-2" variant="secondary">
                        {course.subject}
                    </Badge>
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{course.code} • Grade {course.gradeLevel}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-4">
                        <Avatar className="h-6 w-6">
                            <AvatarFallback>{teacher?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{teacher?.name}</span>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
