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
import { Plus, Pencil, Building2, AlertCircle } from "lucide-react";

export interface ClassItem {
    id: string;
    name: string;
    isActive: boolean;
    studentCount: number;
}

interface ClassManagementProps {
    classes: ClassItem[];
    onAddClass: (name: string) => void;
    onUpdateClass: (id: string, name: string, isActive: boolean) => void;
}

export function ClassManagement({ classes, onAddClass, onUpdateClass }: ClassManagementProps) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newClassName, setNewClassName] = useState("");
    const [editingParams, setEditingParams] = useState<{ id: string, name: string } | null>(null);

    const handleAdd = () => {
        if (newClassName.trim()) {
            onAddClass(newClassName);
            setNewClassName("");
            setIsAddOpen(false);
        }
    };

    const handleEdit = () => {
        if (editingParams && editingParams.name.trim()) {
            // Find original to get status
            const original = classes.find(c => c.id === editingParams.id);
            if (original) {
                onUpdateClass(editingParams.id, editingParams.name, original.isActive);
            }
            setEditingParams(null);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Class Management
                    </CardTitle>
                    <CardDescription>
                        Define grades and classes available in your organization.
                    </CardDescription>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" /> Add Class
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Class</DialogTitle>
                            <DialogDescription>
                                Create a new class (e.g., "Grade 10", "Class 5-A").
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Label htmlFor="className" className="mb-2 block">Class Name</Label>
                            <Input
                                id="className"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                placeholder="Ex: Grade 10"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={!newClassName.trim()}>Create Class</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center border-dashed border-2 rounded-lg">
                        <Building2 className="h-10 w-10 text-muted-foreground/30 mb-2" />
                        <p className="text-muted-foreground">No classes created yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={cls.isActive ? "default" : "secondary"}>
                                            {cls.isActive ? "Active" : "Archived"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{cls.studentCount}</TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditingParams({ id: cls.id, name: cls.name })}
                                        >
                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Switch
                                            checked={cls.isActive}
                                            onCheckedChange={(checked) => onUpdateClass(cls.id, cls.name, checked)}
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
                        <DialogTitle>Edit Class Name</DialogTitle>
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
