"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUsersQuery } from "@/hooks/use-api";
import { useState, useMemo, useEffect } from "react";

function flattenStudents(
  data:
    | {
        students: Array<{ id: string; name: string }>;
      }
    | undefined,
) {
  return data?.students ?? [];
}

interface AttendanceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  classNameLabel: string;
}

export function AttendanceSheet({
  isOpen,
  onClose,
  classNameLabel,
}: AttendanceSheetProps) {
  const { data: usersData } = useUsersQuery(isOpen);
  const students = useMemo(() => flattenStudents(usersData), [usersData]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (students.length > 0) {
      setAttendance((prev) => {
        const next = { ...prev };
        for (const s of students) {
          if (!(s.id in next)) next[s.id] = true;
        }
        return next;
      });
    }
  }, [students]);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Mark Attendance</SheetTitle>
          <SheetDescription>
            {classNameLabel} • {new Date().toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="font-medium text-sm">Student</span>
            <span className="font-medium text-sm">Present</span>
          </div>
          {students.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No students in this tenant.
            </p>
          ) : (
          students.map((student) => (
            <div key={student.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{student.name}</span>
              </div>
              <Checkbox
                checked={attendance[student.id] ?? true}
                onCheckedChange={() => toggleAttendance(student.id)}
              />
            </div>
          )))}
        </div>
        <SheetFooter>
          <Button onClick={onClose}>Save Attendance</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
