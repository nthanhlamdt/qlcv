"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Target, TrendingUp, Calendar, Award } from "lucide-react"

interface ProfileStatsProps {
  stats: {
    tasksCompleted: number
    tasksInProgress: number
    totalTasks: number
    efficiency: number
    averageCompletionTime: number
    currentStreak: number
    totalWorkingDays: number
    achievements: number
  }
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const completionRate = Math.round((stats.tasksCompleted / stats.totalTasks) * 100)

  const statCards = [
    {
      title: "Công việc hoàn thành",
      value: stats.tasksCompleted,
      icon: CheckCircle,
      color: "text-green-500",
      description: `${completionRate}% tỷ lệ hoàn thành`,
    },
    {
      title: "Đang thực hiện",
      value: stats.tasksInProgress,
      icon: Clock,
      color: "text-blue-500",
      description: "Công việc hiện tại",
    },
    {
      title: "Hiệu suất",
      value: `${stats.efficiency}%`,
      icon: Target,
      color: "text-purple-500",
      description: "+5% so với tháng trước",
    },
    {
      title: "Thời gian trung bình",
      value: `${stats.averageCompletionTime}`,
      unit: "ngày",
      icon: TrendingUp,
      color: "text-orange-500",
      description: "Hoàn thành công việc",
    },
    {
      title: "Chuỗi liên tiếp",
      value: stats.currentStreak,
      unit: "ngày",
      icon: Calendar,
      color: "text-red-500",
      description: "Hoàn thành công việc",
    },
    {
      title: "Thành tích",
      value: stats.achievements,
      icon: Award,
      color: "text-yellow-500",
      description: "Huy hiệu đạt được",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="chart-animate" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tiến độ mục tiêu tháng này</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hoàn thành công việc</span>
              <span>{stats.tasksCompleted}/30</span>
            </div>
            <Progress value={(stats.tasksCompleted / 30) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Hiệu suất mục tiêu</span>
              <span>{stats.efficiency}/90%</span>
            </div>
            <Progress value={(stats.efficiency / 90) * 100} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Ngày làm việc</span>
              <span>{stats.totalWorkingDays}/22</span>
            </div>
            <Progress value={(stats.totalWorkingDays / 22) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
