"use client"

import { AnalyticsFilters } from "@/components/analytics/analytics-filters"
import { PerformanceMetrics } from "@/components/analytics/performance-metrics"
import { ProductivityChart } from "@/components/analytics/productivity-chart"
import { TeamPerformanceChart } from "@/components/analytics/team-performance-chart"
import { TaskDistributionChart } from "@/components/analytics/task-distribution-chart"
import { TimeTrackingChart } from "@/components/analytics/time-tracking-chart"
import { TopPerformers } from "@/components/analytics/top-performers"

export default function AnalyticsPage() {
  const handleFiltersChange = (filters: any) => {
    // TODO: Implement filter logic
    console.log("Filters changed:", filters)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Thống kê & Phân tích</h1>
        <p className="text-muted-foreground">Phân tích hiệu suất và xu hướng làm việc của nhóm</p>
      </div>

      <AnalyticsFilters onFiltersChange={handleFiltersChange} />

      <PerformanceMetrics />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductivityChart />
        <TeamPerformanceChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TaskDistributionChart />
        <TimeTrackingChart />
        <TopPerformers />
      </div>
    </div>
  )
}
