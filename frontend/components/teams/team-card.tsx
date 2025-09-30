"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users, Calendar, Eye, Edit, Trash2, User, Clock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

interface Collaborator {
  id: number
  name: string
  avatar?: string
  role: string
}

interface Project {
  id: number
  name: string
  description: string
  collaborators: Collaborator[]
  activeTasks: number
  completedTasks: number
  progress: number
  deadline: string
  priority: "high" | "medium" | "low"
  status: "active" | "completed" | "paused"
}

interface TeamCardProps {
  team: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: number) => void
}

const statusColors = {
  active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  paused: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

const statusLabels = {
  active: "Đang thực hiện",
  completed: "Hoàn thành",
  paused: "Tạm dừng",
}

const priorityColors = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-green-500/10 text-green-500 border-green-500/20",
}

const priorityLabels = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
}

export function TeamCard({ team: project, onEdit, onDelete }: TeamCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-2">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
            <Badge variant="outline" className={priorityColors[project.priority]}>
              {priorityLabels[project.priority]}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/teams/${project.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa dự án
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Tiến độ</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{project.collaborators.length} cộng tác viên</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{project.activeTasks} công việc</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-orange-500 font-medium text-xs">{project.deadline}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Cộng tác viên</span>
            <Link href={`/teams/${project.id}`} className="hover:text-foreground">
              Xem tất cả
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {project.collaborators.slice(0, 4).map((collaborator) => (
              <Avatar key={collaborator.id} className="h-8 w-8">
                <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            ))}
            {project.collaborators.length > 4 && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium">
                +{project.collaborators.length - 4}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Hoàn thành: {project.completedTasks}/{project.completedTasks + project.activeTasks}
          </div>
          <Link href={`/teams/${project.id}`}>
            <Button variant="outline" size="sm">
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
