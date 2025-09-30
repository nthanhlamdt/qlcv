"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Users, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Công việc hoàn thành",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    title: "Công việc đang thực hiện",
    value: "8",
    change: "+3",
    changeType: "positive" as const,
    icon: Clock,
    color: "text-blue-500",
  },
  {
    title: "Thành viên nhóm",
    value: "12",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Hiệu suất",
    value: "94%",
    change: "+5%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "text-orange-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="chart-animate" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>{stat.change}</span>{" "}
              so với tháng trước
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
