"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Clock, Users, CheckCircle } from "lucide-react"

const metrics = [
  {
    title: "Tỷ lệ hoàn thành đúng hạn",
    value: 87,
    target: 90,
    trend: "up",
    change: "+5%",
    icon: Target,
    color: "text-green-500",
  },
  {
    title: "Thời gian trung bình hoàn thành",
    value: 3.2,
    target: 3.0,
    trend: "down",
    change: "-0.3 ngày",
    icon: Clock,
    color: "text-blue-500",
    unit: "ngày",
  },
  {
    title: "Mức độ hài lòng nhóm",
    value: 92,
    target: 85,
    trend: "up",
    change: "+7%",
    icon: Users,
    color: "text-purple-500",
  },
  {
    title: "Chất lượng công việc",
    value: 94,
    target: 90,
    trend: "up",
    change: "+2%",
    icon: CheckCircle,
    color: "text-orange-500",
  },
]

export function PerformanceMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="chart-animate" style={{ animationDelay: `${index * 0.1}s` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit || "%"}
                </div>
                <Badge variant={metric.trend === "up" ? "default" : "secondary"} className="gap-1">
                  {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {metric.change}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Tiến độ</span>
                  <span>
                    Mục tiêu: {metric.target}
                    {metric.unit || "%"}
                  </span>
                </div>
                <Progress
                  value={(metric.value / metric.target) * 100}
                  className="h-2"
                  style={{
                    background: `linear-gradient(to right, ${
                      metric.value >= metric.target ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"
                    } 0%, transparent 100%)`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
