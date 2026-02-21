"use client";

import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useScheduleQuery } from "@/hooks/use-api";

export default function SchedulePage() {
  const { data: items, isLoading } = useScheduleQuery();

  const groupedByDate = useMemo(() => {
    const map = new Map<string, typeof items>();
    (items ?? []).forEach((item) => {
      const day = new Date(item.scheduledAt).toDateString();
      const arr = map.get(day) ?? [];
      arr.push(item);
      map.set(day, arr);
    });
    return [...map.entries()];
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
        <p className="text-muted-foreground">Upcoming scheduled classes.</p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading schedule...</p>
      ) : groupedByDate.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No scheduled classes found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map(([day, dayItems]) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="h-5 w-5" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(dayItems ?? []).map((item) => (
                  <div
                    key={item.id}
                    className="rounded border p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium">{item.course.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.course.class.name} • {item.course.subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Teacher: {item.teacher.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(item.scheduledAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

