"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Megaphone } from "lucide-react";

interface NoticeCardProps {
    title: string;
    date: string;
    category: "Academic" | "Event" | "Admin";
    content: string;
}

export function NoticeCard({ title, date, category, content }: NoticeCardProps) {
    const categoryColors = {
        Academic: "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900 dark:text-blue-300",
        Event: "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900 dark:text-purple-300",
        Admin: "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900 dark:text-amber-300",
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className={categoryColors[category]}>
                        {category}
                    </Badge>
                    <CardTitle className="text-base font-semibold leading-none pt-2">
                        {title}
                    </CardTitle>
                </div>
                <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {content}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    {date}
                </div>
            </CardContent>
        </Card>
    );
}
