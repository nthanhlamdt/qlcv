"use client"

import { useState } from "react"
import { TaskDetailsInfo } from "@/components/tasks/task-details-info"
import { TaskComments } from "@/components/tasks/task-comments"
import { TaskActivity } from "@/components/tasks/task-activity"
import { PersonalTaskHeader } from "@/components/tasks/personal-task-header"
import { TeamTaskHeader } from "@/components/tasks/team-task-header"
import { useRouter } from "next/navigation"
import { PersonalTaskNotes } from "@/components/tasks/personal-task-notes"

// Mock data - trong thực tế sẽ fetch từ API dựa trên ID
const mockTasks = {
  "1": {
    id: 1,
    title: "Thiết kế giao diện trang chủ",
    description: "Tạo mockup và prototype cho trang chủ website mới với focus vào UX/UI hiện đại.",
    status: "in-progress" as const,
    priority: "high" as const,
    assignee: "Nguyễn Văn A",
    dueDate: "15/01/2024",
    avatar: "/user-avatar-1.png",
    tags: ["design", "frontend", "ui/ux"],
    createdDate: "10/01/2024",
    updatedDate: "15/01/2024",
    estimatedHours: 16,
    actualHours: 14,
    type: "personal" as const,
  },
  "2": {
    id: 2,
    title: "Phát triển API đăng nhập",
    description: "Xây dựng endpoint API cho chức năng đăng nhập với JWT authentication",
    status: "in-progress" as const,
    priority: "high" as const,
    assignee: "Trần Thị B",
    dueDate: "18/01/2024",
    avatar: "/user-avatar-2.png",
    tags: ["backend", "api", "authentication"],
    createdDate: "12/01/2024",
    updatedDate: "16/01/2024",
    estimatedHours: 12,
    actualHours: 8,
    type: "team" as const,
    teamId: 1,
    teamName: "Website Redesign Project",
  },
}

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState(mockTasks[params.id as keyof typeof mockTasks] || mockTasks["1"])

  const handleEdit = () => {
    console.log("Edit task:", task.id)
  }

  const handleDelete = () => {
    console.log("Delete task:", task.id)
    router.push("/tasks")
  }

  const handleStatusChange = (newStatus: string) => {
    setTask({
      ...task,
      status: newStatus as "pending" | "in-progress" | "completed",
      updatedDate: new Date().toLocaleDateString("vi-VN"),
    })
  }

  const handleComplete = (data: { note: string; files: File[] }) => {
    console.log("Task completed with:", data)
    // TODO: Save completion data to backend
  }

  const TaskHeader = task.type === "personal" ? PersonalTaskHeader : TeamTaskHeader

  return (
    <div className="space-y-6">
      <TaskHeader
        task={task}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onComplete={handleComplete}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TaskDetailsInfo task={task} />
          {task.type === "personal" ? <PersonalTaskNotes taskId={task.id} /> : <TaskComments taskId={task.id} />}
        </div>
        <div className="space-y-6">
          <TaskActivity taskId={task.id} />
        </div>
      </div>
    </div>
  )
}
