"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassSlotProps {
    subject: string;
    time: string;
    status: "Scheduled" | "Running" | "Completed";
    onClick?: () => void;
}

export function ClassSlot({ subject, time, status, onClick }: ClassSlotProps) {
    const statusStyles = {
        Scheduled: "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10",
        Running: "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10 cursor-pointer hover:shadow-md transition-shadow",
        Completed: "border-l-4 border-l-slate-400 bg-slate-50 dark:bg-slate-900/10 opacity-70",
    };

    return (
        <Card
            className={cn("p-3 flex flex-col gap-1", statusStyles[status])}
            onClick={status === "Running" ? onClick : undefined}
        >
            <div className="flex justify-between items-start">
                <span className="font-semibold text-sm line-clamp-1">{subject}</span>
                {status === "Running" && (
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {time}
            </div>
            <Badge variant="outline" className="w-fit text-[10px] h-5 mt-1 border-0 bg-white/50 dark:bg-black/20">
                {status}
            </Badge>
        </Card>
    );
}
