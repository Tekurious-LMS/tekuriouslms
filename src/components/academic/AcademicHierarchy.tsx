"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    School,
    GraduationCap,
    BookOpen,
    Layers,
    Plus
} from "lucide-react";
import { StructureActions } from "./StructureActions";

// Local mock data for deep hierarchy
const hierarchyData = [
    {
        id: "board_1",
        name: "CBSE Board",
        type: "Board",
        schools: [
            {
                id: "sch_1",
                name: "Greenwood High",
                classes: [
                    {
                        id: "cls_1",
                        name: "Class 10 A",
                        subjects: ["Mathematics", "Physics", "Chemistry"],
                    },
                    {
                        id: "cls_2",
                        name: "Class 9 B",
                        subjects: ["Biology", "History", "English"],
                    },
                ],
            },
        ],
    },
    {
        id: "board_2",
        name: "ICSE Board",
        type: "Board",
        schools: [
            {
                id: "sch_2",
                name: "St. Xavier Code Academy",
                classes: [
                    {
                        id: "cls_3",
                        name: "Class 11 Science",
                        subjects: ["Computer Science", "Mathematics", "Physics"],
                    },
                ],
            },
        ],
    },
];

export function AcademicHierarchy() {
    if (!hierarchyData || hierarchyData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed bg-muted/20 text-center">
                <School className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Academic Structure Found</h3>
                <p className="text-sm text-muted-foreground mb-4">Start by adding a Board to your institution.</p>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Board
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {hierarchyData.map((board) => (
                <Card key={board.id} className="overflow-hidden border-l-4 border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
                        <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg font-bold">{board.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary">Board</Badge>
                            <StructureActions />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {board.schools.map((school) => (
                                <AccordionItem key={school.id} value={school.id} className="border rounded-md px-4 data-[state=open]:bg-muted/10">
                                    <AccordionTrigger className="hover:no-underline py-3">
                                        <div className="flex items-center gap-3 text-base font-medium">
                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                <School className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            {school.name}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 pb-4">
                                        <div className="pl-4 ml-3 border-l-2 border-dashed space-y-2">
                                            {school.classes.length === 0 && (
                                                <p className="text-xs text-muted-foreground italic pl-4">No classes added yet.</p>
                                            )}
                                            <Accordion type="single" collapsible className="w-full">
                                                {school.classes.map((cls) => (
                                                    <AccordionItem key={cls.id} value={cls.id} className="border-0">
                                                        <AccordionTrigger className="hover:no-underline py-2 justify-start gap-2">
                                                            <GraduationCap className="h-4 w-4 text-sky-500" />
                                                            <span className="text-sm font-medium">{cls.name}</span>
                                                            <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">
                                                                {cls.subjects.length} Subjects
                                                            </span>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pl-2 pt-2">
                                                                {cls.subjects.map((subject, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between p-3 rounded-md border bg-card hover:shadow-sm transition-shadow group">
                                                                        <div className="flex items-center gap-2.5">
                                                                            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                                                                            <span className="text-sm font-medium">{subject}</span>
                                                                        </div>
                                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <StructureActions />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                <Button variant="outline" className="h-auto py-3 border-dashed text-muted-foreground hover:text-primary">
                                                                    <code className="text-xs">+ Add Subject</code>
                                                                </Button>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                        <div className="mt-4 pl-7">
                                            <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                                                + Add Class
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <div className="mt-6 pt-4 border-t flex justify-end">
                            <Button variant="outline" size="sm">
                                + Add School
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
