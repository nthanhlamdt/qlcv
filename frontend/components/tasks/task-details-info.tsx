"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Tag, FileText } from "lucide-react"

interface Task {
  id: number | string
  title?: string
  description?: string
  status?: "pending" | "in-progress" | "completed"
  priority?: "high" | "medium" | "low"
  assignee?: string
  dueDate?: string
  avatar?: string
  tags?: string[]
  createdDate?: string
  updatedDate?: string
  estimatedHours?: number
  actualHours?: number
}

interface TaskDetailsInfoProps {
  task: Task
}

export function TaskDetailsInfo({ task }: TaskDetailsInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mô tả
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {task.description || "Chưa có mô tả cho công việc này."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {task.assignee && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Người thực hiện</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
                      <AvatarFallback>
                        <User className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee}</span>
                  </div>
                </div>
              )}

              {task.dueDate && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Hạn hoàn thành</p>
                  <p className="text-sm mt-1">{task.dueDate}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {task.createdDate && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Ngày tạo</p>
                  <p className="text-sm mt-1">{task.createdDate}</p>
                </div>
              )}

              {task.updatedDate && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Cập nhật lần cuối</p>
                  <p className="text-sm mt-1">{task.updatedDate}</p>
                </div>
              )}
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-2">Thẻ</p>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
