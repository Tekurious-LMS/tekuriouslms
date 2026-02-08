"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PerformanceChart() {
  const data = [
    { subject: "Math", score: 85, color: "bg-blue-500" },
    { subject: "Science", score: 72, color: "bg-green-500" },
    { subject: "History", score: 90, color: "bg-yellow-500" },
    { subject: "English", score: 65, color: "bg-purple-500" },
    { subject: "CS", score: 95, color: "bg-red-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full flex items-end justify-between gap-2 mt-4">
          {data.map((item) => (
            <div
              key={item.subject}
              className="flex flex-col items-center gap-2 w-full group"
            >
              <div className="relative w-full flex justify-center">
                <span className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold bg-foreground text-background px-2 py-0.5 rounded">
                  {item.score}%
                </span>
                <div
                  className={`w-full rounded-t-sm transition-all hover:opacity-80 ${item.color}`}
                  style={{ height: `${item.score * 2}px` }} // simple scale
                />
              </div>
              <span className="text-xs font-medium truncate w-full text-center">
                {item.subject}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
