"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Layers } from "lucide-react";

interface StructureOverviewProps {
    totalClasses: number;
    totalSubjects: number;
    totalMappings: number;
}

export function StructureOverview({
    totalClasses,
    totalSubjects,
    totalMappings,
}: StructureOverviewProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalClasses}</div>
                    <p className="text-xs text-muted-foreground">
                        Active grades across organization
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSubjects}</div>
                    <p className="text-xs text-muted-foreground">
                        Global subject catalog
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Mapped Combinations</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMappings}</div>
                    <p className="text-xs text-muted-foreground">
                        Active class-subject associations
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
