"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, User, Clock, Edit, CheckCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"

interface ActivityItem {
  id: number
  type: "status_change" | "assignment" | "comment" | "edit" | "created"
  author: string
  avatar?: string
  description: string
  createdAt: Date
  oldValue?: string
  newValue?: string
}

interface TaskActivityProps {
  taskId: number
}

const activities: ActivityItem[] = [
  {
    id: 1,
    type: "created",
    author: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    description: "đã tạo công việc này",
    createdAt: new Date(2024, 0, 10, 9, 0),
  },
  {
    id: 2,
    type: "assignment",
    author: "Trần Thị B",
    avatar: "/diverse-user-avatar-set-2.png",
    description: "đã giao công việc cho Nguyễn Văn A",
    createdAt: new Date(2024, 0, 10, 9, 15),
  },
  {
    id: 3,
    type: "status_change",
    author: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    description: "đã thay đổi trạng thái",
    oldValue: "Chờ xử lý",
    newValue: "Đang thực hiện",
    createdAt: new Date(2024, 0, 12, 10, 30),
  },
  {
    id: 4,
    type: "edit",
    author: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    description: "đã cập nhật mô tả công việc",
    createdAt: new Date(2024, 0, 14, 16, 45),
  },
  {
    id: 5,
    type: "status_change",
    author: "Nguyễn Văn A",
    avatar: "/user-avatar-1.png",
    description: "đã thay đổi trạng thái",
    oldValue: "Đang thực hiện",
    newValue: "Hoàn thành",
    createdAt: new Date(2024, 0, 15, 17, 0),
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "created":
      return <AlertCircle className="h-4 w-4 text-blue-500" />
    case "status_change":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "assignment":
      return <User className="h-4 w-4 text-purple-500" />
    case "edit":
      return <Edit className="h-4 w-4 text-orange-500" />
    case "comment":
      return <Activity className="h-4 w-4 text-gray-500" />
    default:
      return <Activity className="h-4 w-4 text-gray-500" />
  }
}

export function TaskActivity({ taskId }: TaskActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Lịch sử hoạt động
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex space-x-3">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && <div className="mt-2 h-6 w-px bg-border" />}
              </div>
              <div className="flex-1 space-y-1 pb-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.author} />
                    <AvatarFallback>
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{activity.author}</span>
                  <span className="text-sm text-muted-foreground">{activity.description}</span>
                </div>
                {activity.oldValue && activity.newValue && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                      {activity.oldValue}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {activity.newValue}
                    </Badge>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(activity.createdAt, { addSuffix: true, locale: vi })}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
