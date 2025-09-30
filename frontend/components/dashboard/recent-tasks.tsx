"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User } from "lucide-react"

const recentTasks = [
  {
    id: 1,
    title: "Thiết kế giao diện trang chủ",
    status: "completed",
    priority: "high",
    assignee: "Nguyễn Văn A",
    dueDate: "Hôm nay",
    avatar: "/user-avatar-1.png",
  },
  {
    id: 2,
    title: "Phát triển API đăng nhập",
    status: "in-progress",
    priority: "medium",
    assignee: "Trần Thị B",
    dueDate: "Ngày mai",
    avatar: "/diverse-user-avatar-set-2.png",
  },
  {
    id: 3,
    title: "Kiểm thử tính năng thanh toán",
    status: "pending",
    priority: "high",
    assignee: "Lê Văn C",
    dueDate: "2 ngày nữa",
    avatar: "/diverse-user-avatars-3.png",
  },
  {
    id: 4,
    title: "Tối ưu hóa database",
    status: "in-progress",
    priority: "low",
    assignee: "Phạm Thị D",
    dueDate: "Tuần tới",
    avatar: "/user-avatar-4.png",
  },
]

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
}

const priorityColors = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-gray-500/10 text-gray-500 border-gray-500/20",
}

const statusLabels = {
  completed: "Hoàn thành",
  "in-progress": "Đang thực hiện",
  pending: "Chờ xử lý",
}

const priorityLabels = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
}

export function RecentTasks() {
  return (
    <Card className="chart-animate">
      <CardHeader>
        <CardTitle>Công việc gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.assignee}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={statusColors[task.status as keyof typeof statusColors]}>
                  {statusLabels[task.status as keyof typeof statusLabels]}
                </Badge>
                <Badge variant="outline" className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {priorityLabels[task.priority as keyof typeof priorityLabels]}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {task.dueDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
