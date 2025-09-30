"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Hoàn thành", value: 156, color: "hsl(var(--chart-1))" },
  { name: "Đang thực hiện", value: 45, color: "hsl(var(--chart-2))" },
  { name: "Chờ xử lý", value: 28, color: "hsl(var(--chart-3))" },
  { name: "Quá hạn", value: 12, color: "hsl(var(--chart-5))" },
]

export function TaskDistributionChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Phân bố công việc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-sm text-muted-foreground">Tổng công việc</div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
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
        <div className="grid grid-cols-2 gap-4 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
