"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MoreHorizontal,
  Edit,
  Trash2,
  Share,
  Clock,
  User,
  CheckCircle,
  Users,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { CompleteTaskDialog } from "./complete-task-dialog"

interface Task {
  id: number
  title: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignee: string
  dueDate: string
  avatar?: string
  createdDate: string
  updatedDate: string
  type: "personal" | "team"
  teamId?: number
  teamName?: string
}

interface TeamTaskHeaderProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: string) => void
  onComplete: (data: { note: string; files: File[] }) => void
}

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

export function TeamTaskHeader({ task, onEdit, onDelete, onStatusChange, onComplete }: TeamTaskHeaderProps) {
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)

  const handleComplete = (data: { note: string; files: File[] }) => {
    onComplete(data)
    onStatusChange("completed")
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Chia sẻ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-900">Dự án nhóm</p>
                <p className="text-sm text-blue-700">{task.teamName || "Website Redesign Project"}</p>
              </div>
            </div>
            <Link href={`/teams/${task.teamId || 1}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
              >
                Xem dự án
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-balance">{task.title}</h1>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={statusColors[task.status]}>
                {statusLabels[task.status]}
              </Badge>
              <Badge variant="outline" className={priorityColors[task.priority]}>
                Ưu tiên {priorityLabels[task.priority]}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
                <AvatarFallback>
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span>Được giao cho {task.assignee}</span>
            </div>

            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Hạn: {task.dueDate}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            {task.status !== "completed" && (
              <Button onClick={() => setShowCompleteDialog(true)} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Hoàn thành
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Thay đổi trạng thái
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onStatusChange("pending")}>
                  <Badge variant="outline" className={statusColors.pending}>
                    Chờ xử lý
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange("in-progress")}>
                  <Badge variant="outline" className={statusColors["in-progress"]}>
                    Đang thực hiện
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </div>
      </div>

      <CompleteTaskDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onComplete={handleComplete}
        taskTitle={task.title}
      />
    </>
  )
}
