"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { team: "Frontend", completed: 45, inProgress: 12, overdue: 3, efficiency: 88 },
  { team: "Backend", completed: 38, inProgress: 8, overdue: 2, efficiency: 92 },
  { team: "Design", completed: 32, inProgress: 6, overdue: 1, efficiency: 95 },
  { team: "QA", completed: 28, inProgress: 5, overdue: 2, efficiency: 87 },
  { team: "DevOps", completed: 22, inProgress: 4, overdue: 1, efficiency: 90 },
]

export function TeamPerformanceChart() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Hiệu suất theo nhóm</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="team" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="hsl(var(--chart-1))" name="Hoàn thành" />
            <Bar dataKey="inProgress" fill="hsl(var(--chart-2))" name="Đang thực hiện" />
            <Bar dataKey="overdue" fill="hsl(var(--chart-5))" name="Quá hạn" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
