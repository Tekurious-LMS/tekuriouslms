"use client";

import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentList } from "@/components/courses/StudentList";
import { AssessmentManager } from "@/components/courses/AssessmentManager";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseQuery } from "@/hooks/use-api";

type LessonItem = {
  id: string;
  title: string;
  contentType: string;
  duration?: number | null;
};

type ModuleItem = {
  id: string;
  title: string;
  lessons: LessonItem[];
};

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) ?? null;
  const { data: course, isLoading } = useCourseQuery(courseId);

  const teacherName = course?.teacher?.name ?? "—";
  const subjectName = course?.subject?.name ?? course?.subjectId ?? "—";
  const className = course?.class?.name ?? "—";
  const modules = ((course?.modules ?? []) as ModuleItem[]) ?? [];
  const standaloneLessons = ((course?.lessons ?? []) as LessonItem[]) ?? [];

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
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{subjectName}</Badge>
              <span className="text-sm text-muted-foreground">{className}</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description ?? "—"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-right hidden sm:block">
              <span className="font-medium block">{teacherName}</span>
              <span className="text-muted-foreground text-xs">Instructor</span>
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
          {modules.length === 0 && standaloneLessons.length === 0 ? (
            <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
              No lessons/modules available yet.
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{module.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {module.lessons.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No lessons in this module.</p>
                    ) : (
                      module.lessons.map((lesson) => (
                        <div key={lesson.id} className="rounded border p-3 text-sm">
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-muted-foreground">
                            {lesson.contentType}
                            {lesson.duration ? ` • ${lesson.duration} min` : ""}
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              ))}

              {standaloneLessons.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Standalone Lessons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {standaloneLessons.map((lesson) => (
                      <div key={lesson.id} className="rounded border p-3 text-sm">
                        <p className="font-medium">{lesson.title}</p>
                        <p className="text-muted-foreground">
                          {lesson.contentType}
                          {lesson.duration ? ` • ${lesson.duration} min` : ""}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="students">
          <StudentList courseId={courseId} />
        </TabsContent>

        <TabsContent value="assessments" className="space-y-8">
          <AssessmentManager courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
