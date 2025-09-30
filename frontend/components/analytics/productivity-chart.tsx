"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { date: "01/01", completed: 12, created: 15, efficiency: 80 },
  { date: "02/01", completed: 18, created: 20, efficiency: 90 },
  { date: "03/01", completed: 15, created: 18, efficiency: 83 },
  { date: "04/01", completed: 22, created: 25, efficiency: 88 },
  { date: "05/01", completed: 20, created: 22, efficiency: 91 },
  { date: "06/01", completed: 25, created: 28, efficiency: 89 },
  { date: "07/01", completed: 28, created: 30, efficiency: 93 },
  { date: "08/01", completed: 24, created: 26, efficiency: 92 },
  { date: "09/01", completed: 30, created: 32, efficiency: 94 },
  { date: "10/01", completed: 26, created: 28, efficiency: 93 },
  { date: "11/01", completed: 32, created: 35, efficiency: 91 },
  { date: "12/01", completed: 35, created: 38, efficiency: 92 },
]

export function ProductivityChart() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Xu hướng năng suất</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Hoàn thành"
              dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="created"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="Tạo mới"
              dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="hsl(var(--chart-3))"
              strokeWidth={2}
              name="Hiệu suất (%)"
              dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
