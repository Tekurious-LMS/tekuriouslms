"use client";

import { AcademicHierarchy } from "@/components/academic/AcademicHierarchy";
import { OrphanAlert } from "@/components/academic/OrphanAlert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AcademicStructurePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
                    <p className="text-muted-foreground">
                        Manage boards, schools, classes, and subject hierarchies.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Board
                </Button>
            </div>

            {/* Conditionally show warning */}
            <OrphanAlert />

            <AcademicHierarchy />
        </div>
    );
}
