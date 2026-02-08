"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export function StudentAttemptView() {
  const attempts = [
    { id: 1, quiz: "Algebra Basics", score: 45, total: 50, date: "2024-03-10" },
    { id: 2, quiz: "Newton's Laws", score: 38, total: 50, date: "2024-03-12" },
  ];

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => (
        <Card key={attempt.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">
              {attempt.quiz}
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {attempt.date}
            </span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">
                    {attempt.score}/{attempt.total}
                  </span>
                  <span className="text-xs text-muted-foreground">Score</span>
                </div>
                {attempt.score / attempt.total > 0.8 ? (
                  <div className="flex items-center text-green-600 text-sm gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Great Job
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600 text-sm gap-1">
                    <XCircle className="h-4 w-4" /> Needs Review
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm">
                Review Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
