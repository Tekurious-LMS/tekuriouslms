"use client";

import { useState } from "react";
import { StructureOverview } from "@/components/admin/structure/StructureOverview";
import { ClassItem, ClassManagement } from "@/components/admin/structure/ClassManagement";
import { SubjectItem, SubjectManagement } from "@/components/admin/structure/SubjectManagement";
import { ClassSubjectMap, ClassSubjectMapping } from "@/components/admin/structure/ClassSubjectMapping";
import { Separator } from "@/components/ui/separator";

// --- MOCK DATA FOR PHASE 1 UI ---
const INITIAL_CLASSES: ClassItem[] = [
    { id: "c1", name: "Grade 10", isActive: true, studentCount: 120 },
    { id: "c2", name: "Grade 9", isActive: true, studentCount: 115 },
    { id: "c3", name: "Grade 11 (Sci)", isActive: false, studentCount: 0 },
];

const INITIAL_SUBJECTS: SubjectItem[] = [
    { id: "s1", name: "Mathematics", isActive: true },
    { id: "s2", name: "Physics", isActive: true },
    { id: "s3", name: "English Literature", isActive: true },
    { id: "s4", name: "Computer Science", isActive: true },
    { id: "s5", name: "History", isActive: false },
];

const INITIAL_MAPPINGS: ClassSubjectMap[] = [
    { classId: "c1", subjectIds: ["s1", "s2", "s3"] },
    { classId: "c2", subjectIds: ["s1", "s3"] },
];

export default function AcademicStructurePage() {
    const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
    const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
    const [mappings, setMappings] = useState<ClassSubjectMap[]>(INITIAL_MAPPINGS);

    // --- HANDLERS ---

    const handleAddClass = (name: string) => {
        const newClass: ClassItem = {
            id: `c-${Date.now()}`,
            name,
            isActive: true,
            studentCount: 0
        };
        setClasses([...classes, newClass]);
    };

    const handleUpdateClass = (id: string, name: string, isActive: boolean) => {
        setClasses(classes.map(c => c.id === id ? { ...c, name, isActive } : c));
    };

    const handleAddSubject = (name: string) => {
        const newSubject: SubjectItem = {
            id: `s-${Date.now()}`,
            name,
            isActive: true
        };
        setSubjects([...subjects, newSubject]);
    };

    const handleUpdateSubject = (id: string, name: string, isActive: boolean) => {
        setSubjects(subjects.map(s => s.id === id ? { ...s, name, isActive } : s));
    };

    const handleUpdateMapping = (classId: string, subjectIds: string[]) => {
        const existing = mappings.find(m => m.classId === classId);
        if (existing) {
            setMappings(mappings.map(m => m.classId === classId ? { ...m, subjectIds } : m));
        } else {
            setMappings([...mappings, { classId, subjectIds }]);
        }
    };

    // --- DERIVED METRICS ---
    const totalMappings = mappings.reduce((acc, curr) => acc + curr.subjectIds.length, 0);

    return (
        <div className="w-full min-h-screen bg-background p-4 sm:p-6 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
                <p className="text-muted-foreground">
                    Define the educational hierarchy for your organization.
                    Configure grades, subjects, and their relationships.
                </p>
            </div>

            {/* 1. OVERVIEW */}
            <StructureOverview
                totalClasses={classes.filter(c => c.isActive).length}
                totalSubjects={subjects.filter(s => s.isActive).length}
                totalMappings={totalMappings}
            />

            <Separator />

            {/* 2. CLASS MANAGEMENT */}
            <section id="class-management">
                <ClassManagement
                    classes={classes}
                    onAddClass={handleAddClass}
                    onUpdateClass={handleUpdateClass}
                />
            </section>

            {/* 3. SUBJECT MANAGEMENT */}
            <section id="subject-management">
                <SubjectManagement
                    subjects={subjects}
                    onAddSubject={handleAddSubject}
                    onUpdateSubject={handleUpdateSubject}
                />
            </section>

            {/* 4. MAPPING */}
            <section id="mapping">
                <ClassSubjectMapping
                    classes={classes}
                    subjects={subjects}
                    mappings={mappings}
                    onUpdateMapping={handleUpdateMapping}
                />
            </section>

            <div className="text-center text-xs text-muted-foreground pt-8 pb-4">
                <p>Phase-1 Configuration • Organization Admin Only</p>
            </div>
        </div>
    );
}
