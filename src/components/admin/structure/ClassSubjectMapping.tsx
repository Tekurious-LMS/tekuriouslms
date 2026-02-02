"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Layers, X, ArrowRight } from "lucide-react";
import { ClassItem } from "./ClassManagement";
import { SubjectItem } from "./SubjectManagement";

export interface ClassSubjectMap {
    classId: string;
    subjectIds: string[];
}

interface ClassSubjectMappingProps {
    classes: ClassItem[];
    subjects: SubjectItem[];
    mappings: ClassSubjectMap[];
    onUpdateMapping: (classId: string, subjectIds: string[]) => void;
}

export function ClassSubjectMapping({
    classes,
    subjects,
    mappings,
    onUpdateMapping,
}: ClassSubjectMappingProps) {
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

    const activeClasses = classes.filter(c => c.isActive);
    const activeSubjects = subjects.filter(s => s.isActive);

    // Get current mapping for selected class
    const currentMapping = mappings.find(m => m.classId === selectedClassId) || { classId: selectedClassId, subjectIds: [] };
    const mappedSubjectIds = currentMapping.subjectIds;

    const handleAddSubject = () => {
        if (!selectedClassId || !selectedSubjectId) return;

        const newIds = [...mappedSubjectIds];
        if (!newIds.includes(selectedSubjectId)) {
            newIds.push(selectedSubjectId);
            onUpdateMapping(selectedClassId, newIds);
        }
        setSelectedSubjectId("");
    };

    const handleRemoveSubject = (subjectId: string) => {
        if (!selectedClassId) return;
        const newIds = mappedSubjectIds.filter(id => id !== subjectId);
        onUpdateMapping(selectedClassId, newIds);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Class-Subject Mapping
                </CardTitle>
                <CardDescription>
                    Assign subjects to classes to define the curriculum structure.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Selection Configuration Area */}
                <div className="flex flex-col md:flex-row gap-4 items-end p-4 bg-muted/30 rounded-lg border border-dashed">
                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-medium">Select Class</label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a class..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activeClasses.map(cls => (
                                    <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <ArrowRight className="hidden md:block h-5 w-5 text-muted-foreground mb-3" />

                    <div className="w-full md:w-1/3 space-y-2">
                        <label className="text-sm font-medium">Add Subject</label>
                        <Select
                            value={selectedSubjectId}
                            onValueChange={setSelectedSubjectId}
                            disabled={!selectedClassId}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a subject..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activeSubjects
                                    .filter(s => !mappedSubjectIds.includes(s.id))
                                    .map(subj => (
                                        <SelectItem key={subj.id} value={subj.id}>{subj.name}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={handleAddSubject}
                        disabled={!selectedClassId || !selectedSubjectId}
                    >
                        Assign
                    </Button>
                </div>

                {/* Display Mapped Subjects */}
                {selectedClassId && (
                    <div className="mt-6">
                        <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                            Subjects Assigned to <span className="text-foreground font-semibold">{classes.find(c => c.id === selectedClassId)?.name}</span>
                        </h4>

                        {mappedSubjectIds.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">No subjects assigned yet.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {mappedSubjectIds.map(id => {
                                    const subj = subjects.find(s => s.id === id);
                                    if (!subj) return null;
                                    return (
                                        <Badge key={id} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-2 text-sm bg-background border">
                                            {subj.name}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                                                onClick={() => handleRemoveSubject(id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </Badge>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

            </CardContent>
        </Card>
    );
}
