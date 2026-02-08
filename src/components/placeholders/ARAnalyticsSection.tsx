"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Lock } from "lucide-react";

export function ARAnalyticsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            Immersive Learning Analytics
          </h2>
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        </div>
      </div>

      <Card className="border-dashed border-2 bg-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
            Usage & Engagement Metrics
          </CardTitle>
          <CardDescription>
            Analytics available in a future release.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-60">
          <div className="p-4 rounded-full bg-muted mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h4 className="font-medium">No Data Available</h4>
            <p className="text-sm">
              Real-time tracking of AR/VR session duration, interaction
              heatmaps, and learning outcomes will appear here.
            </p>
          </div>
          <Button disabled variant="ghost" size="sm" className="mt-4">
            <Lock className="mr-2 h-3 w-3" />
            View Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
