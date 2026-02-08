"use client";

import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { RankingTable } from "@/components/analytics/RankingTable";
import { WeakTopicsCard } from "@/components/analytics/WeakTopicsCard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track performance, identify weak spots, and view rankings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Main Chart spans 2 cols on large screens */}
        <div className="col-span-1 lg:col-span-2">
          <PerformanceChart />
        </div>

        {/* Weak Topics Side Card */}
        <div className="col-span-1">
          <WeakTopicsCard />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RankingTable />
        {/* Placeholder for future analytic widget */}
        <div className="border border-dashed rounded-lg p-8 flex items-center justify-center text-muted-foreground h-[300px]">
          Engagement Metrics (Coming Soon)
        </div>
      </div>
    </div>
  );
}
