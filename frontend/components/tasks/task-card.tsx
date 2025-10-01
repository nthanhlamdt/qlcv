"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, MoreHorizontal, Edit, Trash2, Eye, User, Users } from "lucide-react"
import Link from "next/link"

interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignee: string
  dueDate: string
  avatar?: string
  tags: string[]
  team?: {
    id: number
    name: string
    avatar?: string
  }
  type: "personal" | "team"
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  hideTeamLink?: boolean // Ẩn link "Xem nhóm" khi đang ở trong team detail
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

export function TaskCard({ task, onEdit, onDelete, hideTeamLink = false }: TaskCardProps) {
  const frame: Record<string, { frame: string; accent: string; hover: string }> = {
    high: {
      frame: "border-red-300 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/40",
      accent: "bg-gradient-to-b from-red-500 to-red-400",
      hover: "hover:shadow-red-200/60 dark:hover:shadow-red-900/30",
    },
    medium: {
      frame: "border-amber-300 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/40",
      accent: "bg-gradient-to-b from-amber-400 to-amber-300",
      hover: "hover:shadow-amber-200/60 dark:hover:shadow-amber-900/30",
    },
    low: {
      frame: "border-slate-300 bg-slate-50/60 dark:border-slate-800/70 dark:bg-slate-900/30",
      accent: "bg-gradient-to-b from-slate-400 to-slate-300",
      hover: "hover:shadow-slate-200/50 dark:hover:shadow-slate-900/20",
    },
  }
  const styles = frame[task.priority] || frame.low
  return (
    <Card className={`relative overflow-hidden transition-shadow border ${styles.frame} ${styles.hover} hover:shadow-lg`}>
      <span className={`absolute left-0 top-0 h-full w-1.5 ${styles.accent}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm line-clamp-2">{task.title}</h3>
              {task.type === "team" && <Users className="h-3 w-3 text-blue-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/tasks/${task.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
            <Badge variant="outline" className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
          </div>
        </div>

        {task.type === "team" && task.team && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={task.team.avatar || "/placeholder.svg"} alt={task.team.name} />
                  <AvatarFallback className="text-xs">
                    <Users className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-blue-700">Nhóm: {task.team.name}</span>
              </div>
              {!hideTeamLink && (
                <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700">
                  <Link href={`/teams/${task.team.id}`}>Xem nhóm</Link>
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={task.avatar || "/placeholder.svg"} alt={task.assignee} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignee}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {task.dueDate}
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
