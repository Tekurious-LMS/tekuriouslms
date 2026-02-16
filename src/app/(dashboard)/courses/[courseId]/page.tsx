"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentList } from "@/components/courses/StudentList";
import { AssessmentManager } from "@/components/courses/AssessmentManager";
import { StudentAttemptView } from "@/components/courses/StudentAttemptView";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCourseQuery } from "@/hooks/use-api";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) ?? null;
  const { data: course, isLoading } = useCourseQuery(courseId);

  const teacherName = course?.teacher?.name ?? "—";
  const subjectName = course?.subject?.name ?? course?.subjectId ?? "—";
  const className = course?.class?.name ?? "—";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-64 bg-muted animate-pulse rounded" />
        <div className="h-8 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

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
              <Badge variant="outline">{subjectName}</Badge>
              <span className="text-sm text-muted-foreground">
                {className}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {course.description ?? "—"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-right hidden sm:block">
              <div className="font-medium">{teacherName}</div>
              <div className="text-muted-foreground text-xs">Instructor</div>
            </span>
            <Avatar className="h-10 w-10">
              <AvatarFallback>{teacherName.charAt(0)}</AvatarFallback>
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
          <StudentList courseId={courseId} />
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
