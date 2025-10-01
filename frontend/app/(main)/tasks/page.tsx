"use client"

import { useEffect, useState } from "react"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskCard } from "@/components/tasks/task-card"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { EditTaskDialog } from "@/components/tasks/edit-task-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List } from "lucide-react"
import { taskApi } from "@/lib/task-api"

const initialTasks: any[] = []

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [editingTask, setEditingTask] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const loadPersonal = async () => {
    const result = await taskApi.listPersonal()
    const list = result.tasks || []
    setTasks(
      list.map((t: any) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignee: 'Tôi',
        dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString('vi-VN') : 'Chưa có hạn',
        tags: t.tags || [],
        type: 'personal' as const,
      }))
    )
  }

  useEffect(() => {
    loadPersonal()
  }, [])

  const handleCreateTask = async (newTask: any) => {
    await taskApi.createPersonal({
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      tags: newTask.tags,
      dueDate: newTask.dueDate,
    })
    await loadPersonal()
  }

  const handleEditTask = (task: any) => {
    setEditingTask(task)
    setIsEditDialogOpen(true)
  }

  const handleSaveTask = async (updatedTask: any) => {
    await taskApi.updateTask(updatedTask.id, updatedTask)
    setEditingTask(null)
    await loadPersonal()
  }

  const handleDeleteTask = async (taskId: number) => {
    await taskApi.deleteTask(String(taskId))
    await loadPersonal()
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
