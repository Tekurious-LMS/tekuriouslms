"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTenant } from "@/contexts/TenantContext";

export default function SettingsPage() {
  const { currentTenant, currentRole } = useTenant();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Account and organization preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Context</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Role:</span> {currentRole ?? "Not assigned"}
          </p>
          <p>
            <span className="font-medium">Organization:</span>{" "}
            {currentTenant?.name ?? "Not assigned"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

