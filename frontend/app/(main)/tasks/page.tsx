"use client"

import { useState } from "react"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List } from "lucide-react"

const initialTasks = [
  {
    id: 1,
    title: "Thiết kế giao diện trang chủ",
    description: "Tạo mockup và prototype cho trang chủ website mới với focus vào UX/UI hiện đại",
    status: "completed" as const,
    priority: "high" as const,
    assignee: "Nguyễn Văn A",
    dueDate: "15/01/2024",
    avatar: "/user-avatar-1.png",
    tags: ["design", "frontend", "ui/ux"],
    type: "personal" as const,
  },
  {
    id: 2,
    title: "Phát triển API đăng nhập",
    description: "Xây dựng endpoint API cho chức năng đăng nhập với JWT authentication",
    status: "in-progress" as const,
    priority: "medium" as const,
    assignee: "Trần Thị B",
    dueDate: "18/01/2024",
    avatar: "/diverse-user-avatar-set-2.png",
    tags: ["backend", "api", "authentication"],
    type: "team" as const,
    team: {
      id: 1,
      name: "Team Backend",
      avatar: "/team-avatar-1.png",
    },
  },
  {
    id: 3,
    title: "Kiểm thử tính năng thanh toán",
    description: "Thực hiện test case cho module thanh toán online và tích hợp payment gateway",
    status: "pending" as const,
    priority: "high" as const,
    assignee: "Lê Văn C",
    dueDate: "20/01/2024",
    avatar: "/diverse-user-avatars-3.png",
    tags: ["testing", "payment", "qa"],
    type: "personal" as const,
  },
  {
    id: 4,
    title: "Tối ưu hóa database",
    description: "Cải thiện performance database bằng cách tối ưu query và thêm index",
    status: "in-progress" as const,
    priority: "low" as const,
    assignee: "Phạm Thị D",
    dueDate: "25/01/2024",
    avatar: "/user-avatar-4.png",
    tags: ["database", "performance", "optimization"],
    type: "team" as const,
    team: {
      id: 2,
      name: "Team Database",
      avatar: "/team-avatar-2.png",
    },
  },
  {
    id: 5,
    title: "Viết tài liệu API",
    description: "Tạo documentation chi tiết cho tất cả API endpoints sử dụng Swagger",
    status: "pending" as const,
    priority: "medium" as const,
    assignee: "Nguyễn Văn A",
    dueDate: "22/01/2024",
    avatar: "/user-avatar-1.png",
    tags: ["documentation", "api"],
    type: "team" as const,
    team: {
      id: 1,
      name: "Team Backend",
      avatar: "/team-avatar-1.png",
    },
  },
  {
    id: 6,
    title: "Setup CI/CD pipeline",
    description: "Cấu hình GitHub Actions để tự động deploy lên staging và production",
    status: "pending" as const,
    priority: "high" as const,
    assignee: "Trần Thị B",
    dueDate: "28/01/2024",
    avatar: "/diverse-user-avatar-set-2.png",
    tags: ["devops", "ci/cd", "deployment"],
    type: "personal" as const,
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleCreateTask = (newTask: any) => {
    const taskWithId = { ...newTask, id: Date.now() }
    setTasks([taskWithId, ...tasks])
  }

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

  const handleFilterChange = (filters: any) => {
    // TODO: Implement filtering logic
    console.log("Filters changed:", filters)
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Quản lý công việc cá nhân</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý tất cả công việc cá nhân của bạn</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <CreateTaskDialog onCreateTask={handleCreateTask} />
        </div>
      </div>

      <TaskFilters onFilterChange={handleFilterChange} />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Chờ xử lý ({getTasksByStatus("pending").length})</TabsTrigger>
          <TabsTrigger value="in-progress">Đang thực hiện ({getTasksByStatus("in-progress").length})</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành ({getTasksByStatus("completed").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {getTasksByStatus("pending").map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {getTasksByStatus("in-progress").map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
            {getTasksByStatus("completed").map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTask}
      />
    </div>
  )
}
