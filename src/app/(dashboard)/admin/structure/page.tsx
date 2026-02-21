"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useInvalidateQueries, useStructureQuery } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AcademicStructurePage() {
  const { data: structure, isLoading } = useStructureQuery();
  const { invalidateStructure } = useInvalidateQueries();

  const [newClassName, setNewClassName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [saving, setSaving] = useState(false);

  const classSubjects = useMemo(() => {
    const byClassId = new Map<string, Set<string>>();
    (structure?.mappings ?? []).forEach((m) => {
      if (!byClassId.has(m.classId)) byClassId.set(m.classId, new Set());
      byClassId.get(m.classId)?.add(m.subjectId);
    });
    return byClassId;
  }, [structure]);

  const availableSubjects = useMemo(() => {
    if (!selectedClassId) return structure?.subjects ?? [];
    const alreadyMapped = classSubjects.get(selectedClassId) ?? new Set<string>();
    return (structure?.subjects ?? []).filter((s) => !alreadyMapped.has(s.id));
  }, [classSubjects, selectedClassId, structure?.subjects]);

  const reloadStructure = async () => {
    await invalidateStructure();
  };

  const createClass = async () => {
    if (!newClassName.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/api/structure/class", {
        method: "POST",
        body: JSON.stringify({ name: newClassName.trim() }),
      });
      setNewClassName("");
      await reloadStructure();
      toast.success("Class created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create class");
    } finally {
      setSaving(false);
    }
  };

  const createSubject = async () => {
    if (!newSubjectName.trim()) return;
    setSaving(true);
    try {
      await apiFetch("/api/structure/subject", {
        method: "POST",
        body: JSON.stringify({ name: newSubjectName.trim() }),
      });
      setNewSubjectName("");
      await reloadStructure();
      toast.success("Subject created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create subject");
    } finally {
      setSaving(false);
    }
  };

  const mapSubject = async () => {
    if (!selectedClassId || !selectedSubjectId) return;
    setSaving(true);
    try {
      await apiFetch("/api/structure/mapping", {
        method: "POST",
        body: JSON.stringify({
          classId: selectedClassId,
          subjectId: selectedSubjectId,
        }),
      });
      setSelectedSubjectId("");
      await reloadStructure();
      toast.success("Subject mapped to class");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to map subject");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-muted-foreground">Loading structure...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Structure</h1>
        <p className="text-muted-foreground">
          Manage classes, subjects, and class-subject mappings for your tenant.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Class</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Grade 10"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <Button onClick={createClass} disabled={saving || !newClassName.trim()}>
              Create
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Subject</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Input
              placeholder="Mathematics"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <Button onClick={createSubject} disabled={saving || !newSubjectName.trim()}>
              Create
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Map Subject to Class</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {(structure?.classes ?? []).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={mapSubject}
            disabled={saving || !selectedClassId || !selectedSubjectId}
          >
            Map
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(structure?.classes ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes yet.</p>
            ) : (
              (structure?.classes ?? []).map((c) => (
                <div key={c.id} className="rounded border p-3">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {c.subjects.length} subject(s) mapped
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(structure?.subjects ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">No subjects yet.</p>
            ) : (
              (structure?.subjects ?? []).map((s) => (
                <div key={s.id} className="rounded border p-3">
                  <p className="font-medium">{s.name}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

