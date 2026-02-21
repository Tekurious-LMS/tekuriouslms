"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";
import { useAssessmentsQuery, useCoursesQuery, useInvalidateQueries } from "@/hooks/use-api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessmentManagerProps {
  courseId?: string | null;
}

type AssessmentItem = {
  id: string;
  title: string;
  dueDate?: string | null;
  totalMarks?: number;
  course?: { id?: string; title?: string };
};

export function AssessmentManager({ courseId }: AssessmentManagerProps) {
  const { data: courses } = useCoursesQuery();
  const { data: assessments } = useAssessmentsQuery();
  const { invalidateAssessments } = useInvalidateQueries();

  const [selectedCourseId, setSelectedCourseId] = useState(courseId ?? "");
  const [title, setTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [date, setDate] = useState<Date>();
  const [correctOption, setCorrectOption] = useState<"0" | "1">("0");
  const [saving, setSaving] = useState(false);

  const visibleAssessments = useMemo(() => {
    const list = (assessments ?? []) as AssessmentItem[];
    if (!selectedCourseId) return list;
    return list.filter((a) => a.course?.id === selectedCourseId);
  }, [assessments, selectedCourseId]);

  const createAssessment = async () => {
    if (!selectedCourseId || !title.trim() || !questionText.trim() || !optionA.trim() || !optionB.trim()) {
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/api/assessments", {
        method: "POST",
        body: JSON.stringify({
          courseId: selectedCourseId,
          title: title.trim(),
          dueDate: date ? date.toISOString() : undefined,
          questions: [
            {
              questionText: questionText.trim(),
              options: [optionA.trim(), optionB.trim()],
              correctOptionIndex: Number(correctOption),
            },
          ],
        }),
      });

      await invalidateAssessments();
      setTitle("");
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setDate(undefined);
      setCorrectOption("0");
      toast.success("Assessment created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create assessment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Create New Assessment</h3>
          <div className="grid gap-4 md:grid-cols-2 items-end">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {(courses ?? []).map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input
                id="title"
                placeholder="Mid-term Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionText">Question</Label>
              <Input
                id="questionText"
                placeholder="Enter MCQ question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionA">Option A</Label>
              <Input
                id="optionA"
                placeholder="First option"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="optionB">Option B</Label>
              <Input
                id="optionB"
                placeholder="Second option"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Correct Option</Label>
              <Select value={correctOption} onValueChange={(value) => setCorrectOption(value as "0" | "1")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Option A</SelectItem>
                  <SelectItem value="1">Option B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={createAssessment}
              disabled={
                saving ||
                !selectedCourseId ||
                !title.trim() ||
                !questionText.trim() ||
                !optionA.trim() ||
                !optionB.trim()
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              {saving ? "Creating..." : "Create Assessment"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Existing Assessments</h3>
        {visibleAssessments.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            No assessments found for this selection.
          </div>
        ) : (
          visibleAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="rounded-md border p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50"
            >
              <div>
                <div className="font-medium">{assessment.title}</div>
                <div className="text-sm text-muted-foreground">
                  Course: {assessment.course?.title ?? "N/A"} • Due:{" "}
                  {assessment.dueDate
                    ? new Date(assessment.dueDate).toLocaleDateString()
                    : "Not set"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

