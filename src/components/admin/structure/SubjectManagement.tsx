"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, BookOpen } from "lucide-react";

export interface SubjectItem {
    id: string;
    name: string;
    isActive: boolean;
}

interface SubjectManagementProps {
    subjects: SubjectItem[];
    onAddSubject: (name: string) => void;
    onUpdateSubject: (id: string, name: string, isActive: boolean) => void;
}

export function SubjectManagement({ subjects, onAddSubject, onUpdateSubject }: SubjectManagementProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState("");
    const [editingParams, setEditingParams] = useState<{ id: string, name: string } | null>(null);

    const handleAdd = () => {
        if (newSubjectName.trim()) {
            onAddSubject(newSubjectName);
            setNewSubjectName("");
            setIsAddOpen(false);
        }
    };

    const handleEdit = () => {
        if (editingParams && editingParams.name.trim()) {
            const original = subjects.find(s => s.id === editingParams.id);
            if (original) {
                onUpdateSubject(editingParams.id, editingParams.name, original.isActive);
            }
            setEditingParams(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Subject Management
                    </CardTitle>
                    <CardDescription>
                        Manage the global catalog of subjects offered.
                    </CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" /> Add Subject
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Subject</DialogTitle>
                            <DialogDescription>
                                Create a new subject (e.g., "Mathematics", "Physics").
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="subjectName" className="mb-2 block">Subject Name</Label>
                            <Input
                                id="subjectName"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                placeholder="Ex: Mathematics"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newSubjectName.trim()}>Create Subject</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {subjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 rounded-lg">
                        <BookOpen className="h-10 w-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">No subjects created yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subject Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects.map((subj) => (
                                <TableRow key={subj.id}>
                                    <TableCell className="font-medium">{subj.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={subj.isActive ? "secondary" : "outline"} className={subj.isActive ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : ""}>
                                            {subj.isActive ? "Active" : "Disabled"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingParams({ id: subj.id, name: subj.name })}
                                        >
                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Switch
                                            checked={subj.isActive}
                                            onCheckedChange={(checked) => onUpdateSubject(subj.id, subj.name, checked)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <Dialog open={!!editingParams} onOpenChange={(open) => !open && setEditingParams(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Subject Name</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={editingParams?.name || ""}
                            onChange={(e) => setEditingParams(prev => prev ? { ...prev, name: e.target.value } : null)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingParams(null)}>Cancel</Button>
                        <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
