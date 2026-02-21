"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssessmentsQuery, useCoursesQuery } from "@/hooks/use-api";
import { useTenant } from "@/contexts/TenantContext";
import { AssessmentManager } from "@/components/courses/AssessmentManager";

type AssessmentItem = {
  id: string;
  title: string;
  dueDate?: string | null;
  totalMarks?: number;
  type?: string;
  course?: { id?: string; title?: string };
};

export default function AssessmentsPage() {
  const { data: assessmentsData, isLoading } = useAssessmentsQuery();
  const { data: courses } = useCoursesQuery();
  const { currentRole } = useTenant();
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  const assessments = (assessmentsData ?? []) as AssessmentItem[];
  const role = (currentRole ?? "").toLowerCase();
  const canCreate = role === "teacher";

  const filtered = useMemo(() => {
    if (selectedCourseId === "all") return assessments;
    return assessments.filter((a) => a.course?.id === selectedCourseId);
  }, [assessments, selectedCourseId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">
          View and manage assessments for your tenant role.
        </p>
      </div>

      <div className="max-w-sm">
        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {(courses ?? []).map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {canCreate && (
        <AssessmentManager courseId={selectedCourseId === "all" ? null : selectedCourseId} />
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading assessments...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No assessments found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <CardTitle>{assessment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Course:</span>{" "}
                  {assessment.course?.title ?? "N/A"}
                </p>
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {assessment.type ?? "MCQ"}
                </p>
                <p>
                  <span className="text-muted-foreground">Total Marks:</span>{" "}
                  {assessment.totalMarks ?? "-"}
                </p>
                <p>
                  <span className="text-muted-foreground">Due Date:</span>{" "}
                  {assessment.dueDate
                    ? new Date(assessment.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
