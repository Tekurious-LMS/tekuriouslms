"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { courses, users } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentList } from "@/components/courses/StudentList";
import { AssessmentManager } from "@/components/courses/AssessmentManager";
import { StudentAttemptView } from "@/components/courses/StudentAttemptView";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CourseDetailPage() {
  // Correctly unwrap params using React.use() as per Next.js 15+ guidance for client components,
  // although useParams() hook from next/navigation handles this automatically.
  // However, let's treat params as a possibility to be typed explicitly if passed as props,
  // but here we use the hook which is standard for client components.
  const params = useParams();
  const courseId = params?.courseId as string;

  // Fallback if params aren't loaded yet? Usually useParams is sync enough for initial render in client.

  const course = courses.find((c) => c.id === courseId);
  const teacher = users.find((u) => u.id === course?.teacherId);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{course.subject}</Badge>
              <span className="text-sm text-muted-foreground">
                {course.code}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              Grade {course.gradeLevel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-right hidden sm:block">
              <div className="font-medium">{teacher?.name}</div>
              <div className="text-muted-foreground text-xs">Instuctor</div>
            </span>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{teacher?.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <Separator />
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
            <h3 className="text-lg font-medium mb-2">Course Modules</h3>
            <p>Content management UI (Videos, PDFs) would go here.</p>
            <Button className="mt-4" variant="outline">
              Add Module
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <StudentList />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-8">
          <AssessmentManager />

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Recent Student Activity (Mock)
            </h3>
            <StudentAttemptView />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
