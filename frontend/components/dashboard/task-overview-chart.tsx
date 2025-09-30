"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "T2", completed: 4, inProgress: 2, pending: 1 },
  { name: "T3", completed: 6, inProgress: 3, pending: 2 },
  { name: "T4", completed: 8, inProgress: 1, pending: 3 },
  { name: "T5", completed: 5, inProgress: 4, pending: 1 },
  { name: "T6", completed: 7, inProgress: 2, pending: 2 },
  { name: "T7", completed: 3, inProgress: 1, pending: 0 },
  { name: "CN", completed: 2, inProgress: 0, pending: 1 },
]

export function TaskOverviewChart() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Tổng quan công việc theo tuần</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="completed" stackId="a" fill="hsl(var(--green-chart))" name="Hoàn thành" />
            <Bar dataKey="inProgress" stackId="a" fill="hsl(var(--blue-chart))" name="Đang thực hiện" />
            <Bar dataKey="pending" stackId="a" fill="hsl(var(--orange-chart))" name="Chờ xử lý" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
