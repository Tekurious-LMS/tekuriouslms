"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function OrphanAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Orphan Data Warning</AlertTitle>
      <AlertDescription>
        There are 3 subjects that are not linked to any class. Please review the
        structure.
      </AlertDescription>
    </Alert>
  );
}
