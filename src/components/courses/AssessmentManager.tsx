"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function AssessmentManager() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Create New Assessment</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Assessment Title</Label>
              <Input id="title" placeholder="e.g. Mid-term Physics Quiz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marks">Total Marks</Label>
              <Input id="marks" type="number" placeholder="50" />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
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
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Existing Assessments</h3>
        <div className="rounded-md border p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="font-medium">Algebra Basics Quiz</div>
            <div className="text-sm text-muted-foreground">
              Due: March 15, 2024 • 50 Marks
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
        <div className="rounded-md border p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="font-medium">Newton&apos;s Laws Test</div>
            <div className="text-sm text-muted-foreground">
              Due: March 20, 2024 • 100 Marks
            </div>
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
