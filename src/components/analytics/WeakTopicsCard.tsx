"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function WeakTopicsCard() {
  const weakTopics = [
    { subject: "Math", topic: "Quadratic Equations", score: 35 },
    { subject: "Science", topic: "Organic Chemistry", score: 38 },
  ];

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Attention Needed
        </CardTitle>
        <AlertCircle className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weakTopics.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/10"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{item.topic}</span>
                <span className="text-xs text-muted-foreground">
                  {item.subject}
                </span>
              </div>
              <span className="font-bold text-red-600 text-sm">
                {item.score}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
