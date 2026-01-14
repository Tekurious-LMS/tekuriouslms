"use client";

import { ClassSlot } from "@/components/schedule/ClassSlot";
import { AttendanceSheet } from "@/components/schedule/AttendanceSheet";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Mock schedule data: dayIndex (0-4) -> slotIndex (0-6) -> Class Info
const scheduleData: Record<string, { subject: string; status: "Scheduled" | "Running" | "Completed" }> = {
    "0-0": { subject: "Mathematics", status: "Completed" },
    "0-2": { subject: "Physics", status: "Running" }, // Monday 11 AM
    "1-1": { subject: "Chemistry", status: "Scheduled" },
    "1-4": { subject: "History", status: "Scheduled" },
    "2-0": { subject: "English", status: "Scheduled" },
    "3-3": { subject: "Computer Science", status: "Scheduled" },
    "4-2": { subject: "Art", status: "Scheduled" },
};

export default function SchedulePage() {
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<string>("");

    const handleClassClick = (subject: string) => {
        setSelectedClass(subject);
        setIsAttendanceOpen(true);
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
                    <p className="text-muted-foreground">Weekly timetable and attendance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="font-medium">March 11 - 15</span>
                    <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-background shadow-sm">
                <div className="grid grid-cols-6 h-full divide-x divide-y">
                    {/* Header Row */}
                    <div className="bg-muted/50 p-4 font-semibold text-center text-sm flex items-center justify-center">Time</div>
                    {weekDays.map(day => (
                        <div key={day} className="bg-muted/50 p-4 font-semibold text-center text-sm flex items-center justify-center">
                            {day}
                        </div>
                    ))}

                    {/* Time Slots Rows */}
                    {timeSlots.map((time, timeIndex) => (
                        <>
                            <div key={`time-${timeIndex}`} className="p-2 text-xs text-muted-foreground font-medium flex items-start justify-center pt-4 bg-slate-50/50 dark:bg-slate-900/30">
                                {time}
                            </div>
                            {weekDays.map((_, dayIndex) => {
                                const key = `${dayIndex}-${timeIndex}`;
                                const classInfo = scheduleData[key];

                                return (
                                    <div key={key} className="p-2 min-h-[100px] relative">
                                        {classInfo && (
                                            <ClassSlot
                                                subject={classInfo.subject}
                                                time={time}
                                                status={classInfo.status}
                                                onClick={() => handleClassClick(classInfo.subject)}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
            </div>

            <AttendanceSheet
                isOpen={isAttendanceOpen}
                onClose={() => setIsAttendanceOpen(false)}
                classNameLabel={selectedClass}
            />
        </div>
    );
}
