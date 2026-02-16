"use client";

import { CourseCard } from "@/components/courses/CourseCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCoursesQuery } from "@/hooks/use-api";

export default function CoursesPage() {
  const { data: courses, isLoading } = useCoursesQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your course catalog and enrollments.
          </p>
        </div>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg border bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses?.length === 0 ? (
            <p className="text-muted-foreground col-span-full">
              No courses yet. Create one to get started.
            </p>
          ) : (
            courses?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
