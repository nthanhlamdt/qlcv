"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { ArrowLeft, Calendar, Settings, Plus, Clock, Target, CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

const mockProject = {
  id: 1,
  name: "Website Thương mại điện tử",
  description:
    "Dự án phát triển website bán hàng online với đầy đủ tính năng thanh toán, quản lý đơn hàng và tích hợp với các hệ thống vận chuyển.",
  status: "active" as const,
  priority: "high" as const,
  deadline: "30/03/2024",
  activeTasks: 15,
  completedTasks: 42,
  progress: 75,
  createdDate: "15/12/2023",
}

const mockProjectTasks = [
  {
    id: 1,
    title: "Thiết kế giao diện trang chủ",
    description: "Tạo mockup và prototype cho trang chủ website thương mại điện tử",
    status: "in-progress" as const,
    priority: "high" as const,
    assignee: "Phạm Thị D",
    dueDate: "25/01/2024",
    avatar: "/user-avatar-4.png",
    tags: ["UI/UX", "Frontend"],
  },
  {
    id: 2,
    title: "Phát triển API thanh toán",
    description: "Tích hợp các cổng thanh toán VNPay, MoMo và ZaloPay",
    status: "pending" as const,
    priority: "high" as const,
    assignee: "Lê Văn C",
    dueDate: "30/01/2024",
    avatar: "/diverse-user-avatars-3.png",
    tags: ["Backend", "Payment"],
  },
  {
    id: 3,
    title: "Xây dựng trang sản phẩm",
    description: "Phát triển trang hiển thị chi tiết sản phẩm với gallery và reviews",
    status: "completed" as const,
    priority: "medium" as const,
    assignee: "Trần Thị B",
    dueDate: "20/01/2024",
    avatar: "/diverse-user-avatar-set-2.png",
    tags: ["Frontend", "React"],
  },
  {
    id: 4,
    title: "Thiết lập hệ thống quản lý đơn hàng",
    description: "Xây dựng dashboard quản lý đơn hàng cho admin",
    status: "in-progress" as const,
    priority: "medium" as const,
    assignee: "Nguyễn Văn A",
    dueDate: "05/02/2024",
    avatar: "/user-avatar-1.png",
    tags: ["Backend", "Admin"],
  },
  {
    id: 5,
    title: "Tối ưu hóa SEO",
    description: "Cải thiện SEO cho tất cả các trang sản phẩm",
    status: "pending" as const,
    priority: "low" as const,
    assignee: "Trần Thị B",
    dueDate: "15/02/2024",
    avatar: "/diverse-user-avatar-set-2.png",
    tags: ["SEO", "Marketing"],
  },
  {
    id: 6,
    title: "Testing và QA",
    description: "Kiểm tra toàn bộ hệ thống và sửa lỗi",
    status: "pending" as const,
    priority: "medium" as const,
    assignee: "Lê Văn C",
    dueDate: "20/02/2024",
    avatar: "/diverse-user-avatars-3.png",
    tags: ["Testing", "QA"],
  },
]

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

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project] = useState(mockProject)
  const [tasks, setTasks] = useState(mockProjectTasks)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const handleSaveTask = (updatedTask: any) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleAddTask = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCreateTask = (newTask: any) => {
    const taskWithId = { ...newTask, id: Date.now() }
    setTasks([taskWithId, ...tasks])
  }

  const completedTasksCount = tasks.filter((task) => task.status === "completed").length
  const inProgressTasksCount = tasks.filter((task) => task.status === "in-progress").length
  const pendingTasksCount = tasks.filter((task) => task.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Link href="/teams">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-balance">{project.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={statusColors[project.status]}>
                {statusLabels[project.status]}
              </Badge>
              <Badge variant="outline" className={priorityColors[project.priority]}>
                {priorityLabels[project.priority]}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleAddTask}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm công việc
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Cài đặt dự án
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công việc</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">{completedTasksCount} đã hoàn thành</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang thực hiện</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{inProgressTasksCount}</div>
            <p className="text-xs text-muted-foreground">{pendingTasksCount} chờ xử lý</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiến độ dự án</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deadline</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{project.deadline}</div>
            <p className="text-xs text-muted-foreground">Còn 45 ngày</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách công việc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Chưa có công việc nào trong dự án này</p>
              <Button onClick={handleAddTask} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Tạo công việc đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateTask={handleCreateTask}
      />

      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTask}
      />
    </div>
  )
}
