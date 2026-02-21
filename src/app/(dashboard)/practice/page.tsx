"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssessmentsQuery } from "@/hooks/use-api";

type AssessmentItem = {
  id: string;
  title: string;
  dueDate?: string | null;
  type?: string;
  totalMarks?: number;
  course?: { title?: string };
};

export default function PracticePage() {
  const { data, isLoading } = useAssessmentsQuery();
  const assessments = (data ?? []) as AssessmentItem[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Practice & Assessments</h1>
        <p className="text-muted-foreground">
          Attempt and review assessments available to your role.
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading assessments...</p>
      ) : assessments.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No assessments available.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{assessment.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Course</span>
                  <span>{assessment.course?.title ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <Badge variant="outline">{assessment.type ?? "MCQ"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Marks</span>
                  <span>{assessment.totalMarks ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span>
                    {assessment.dueDate
                      ? new Date(assessment.dueDate).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

