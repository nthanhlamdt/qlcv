"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Hoàn thành đúng hạn", value: 65, color: "hsl(var(--green-chart))" },
  { name: "Hoàn thành trễ", value: 20, color: "hsl(var(--orange-chart))" },
  { name: "Đang thực hiện", value: 15, color: "hsl(var(--blue-chart))" },
]

export function TeamPerformance() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Hiệu suất nhóm</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
