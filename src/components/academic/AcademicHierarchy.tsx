import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, BookOpen, Layers, Plus } from "lucide-react";
import { StructureActions } from "./StructureActions";
import { useStructureQuery } from "@/hooks/use-api";

export function AcademicHierarchy() {
  const { data: structure, isLoading } = useStructureQuery();
  const classes = structure?.classes ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed bg-muted/20">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-4" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed bg-muted/20 text-center">
        <School className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Academic Structure Found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start by adding a class to your institution.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Class
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {classes.map((cls) => (
        <Card
          key={cls.id}
          className="overflow-hidden border-l-4 border-l-primary"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">{cls.name}</CardTitle>
            </div>
            <StructureActions />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cls.subjects.length === 0 ? (
                <p className="text-xs text-muted-foreground italic col-span-full">
                  No subjects added yet.
                </p>
              ) : (
                cls.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-3 rounded-md border bg-card hover:shadow-sm transition-shadow group"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-sm font-medium">{subject.name}</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <StructureActions />
                    </div>
                  </div>
                ))
              )}
              <Button
                variant="outline"
                className="h-auto py-3 border-dashed text-muted-foreground hover:text-primary"
              >
                <code className="text-xs">+ Add Subject</code>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
