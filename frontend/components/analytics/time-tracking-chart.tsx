"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "T2", planned: 8, actual: 7.5, overtime: 0.5 },
  { date: "T3", planned: 8, actual: 8.2, overtime: 1.2 },
  { date: "T4", planned: 8, actual: 7.8, overtime: 0.8 },
  { date: "T5", planned: 8, actual: 9.1, overtime: 2.1 },
  { date: "T6", planned: 8, actual: 8.5, overtime: 1.5 },
  { date: "T7", planned: 4, actual: 3.2, overtime: 0 },
  { date: "CN", planned: 0, actual: 1.5, overtime: 1.5 },
]

export function TimeTrackingChart() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Theo dõi thời gian làm việc</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
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
            <Area
              type="monotone"
              dataKey="planned"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
              name="Kế hoạch (giờ)"
            />
            <Area
              type="monotone"
              dataKey="actual"
              stackId="2"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
              name="Thực tế (giờ)"
            />
            <Area
              type="monotone"
              dataKey="overtime"
              stackId="3"
              stroke="hsl(var(--chart-5))"
              fill="hsl(var(--chart-5))"
              fillOpacity={0.6}
              name="Làm thêm (giờ)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
