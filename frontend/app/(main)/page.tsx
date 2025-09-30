import { StatsCards } from "@/components/dashboard/stats-cards"
import { TaskOverviewChart } from "@/components/dashboard/task-overview-chart"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { TeamPerformance } from "@/components/dashboard/team-performance"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về công việc và hiệu suất nhóm của bạn</p>
      </div>

      <StatsCards />

      <div className="grid gap-6 md:grid-cols-2">
        <TaskOverviewChart />
        <TeamPerformance />
      </div>

      <RecentTasks />
    </div>
  )
}
