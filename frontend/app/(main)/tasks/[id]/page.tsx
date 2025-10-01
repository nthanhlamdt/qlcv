"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { taskApi } from "@/lib/task-api"
import { TaskDetailsInfo } from "@/components/tasks/task-details-info"
import { TaskComments } from "@/components/tasks/task-comments"
import { PersonalTaskNotes } from "@/components/tasks/personal-task-notes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { File as FileIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = String(params.id)

  const [task, setTask] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; url: string; type: string; size: number }>>([])

  const loadTask = async () => {
    try {
      setLoading(true)
      const t = await taskApi.getTask(taskId)
      const mapped: any = {
        id: t._id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignee: (t.assignees || []).map((u: any) => u?.name).filter(Boolean).join(", ") || "Chưa phân công",
        dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("vi-VN") : "Chưa có hạn",
        avatar: undefined,
        tags: t.tags || [],
        createdDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString("vi-VN") : "",
        updatedDate: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString("vi-VN") : "",
        estimatedHours: (t as any).estimatedHours || 0,
        actualHours: (t as any).actualHours || 0,
        type: (t as any).type ? (t as any).type : (t.team ? 'team' : 'personal'),
        teamId: t.team || undefined,
        teamName: (t.team && t.team.name) || undefined,
      }
      setTask(mapped)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (taskId) loadTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId])

  const handleEdit = async () => {
    router.push(`/tasks/${taskId}`) // placeholder; could open edit dialog page
  }

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa công việc này?")) return
    await taskApi.deleteTask(taskId)
    router.push("/tasks")
  }

  const handleStatusChange = async (newStatus: string) => {
    await taskApi.updateTask(taskId, { status: newStatus as any })
    await loadTask()
  }

  const handleComplete = async (data: { note: string; files: File[] }) => {
    await taskApi.updateTask(taskId, { status: "completed" as any })
    await loadTask()
  }

  if (loading) return <div>Đang tải...</div>
  if (!task) return <div>Không tìm thấy công việc</div>

  return (
    <div className="space-y-6">
      {/* Top bar: back + actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/tasks")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </div>

      {/* Summary header */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold leading-tight">{task.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Mã: {task.id}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className={
                task.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                  task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                    'bg-orange-500/10 text-orange-600 border-orange-500/20'
                    + ' h-6 px-2 text-xs'}>
                {task.status === 'pending' ? 'Chờ xử lý' : task.status === 'in-progress' ? 'Đang thực hiện' : 'Hoàn thành'}
              </Badge>
              <Badge variant="outline" className="h-6 px-2 text-xs">Ưu tiên {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Hạn: {task.dueDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Người thực hiện: {task.assignee}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TaskDetailsInfo task={task} />
          {task.type === "personal" ? <PersonalTaskNotes taskId={task.id} /> : <TaskComments taskId={task.id} />}
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tệp đính kèm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => {
                  const files = Array.from(e.target.files || [])
                  const next = files.map((f) => ({
                    id: `${Date.now()}-${f.name}`,
                    name: f.name,
                    url: URL.createObjectURL(f),
                    type: f.type,
                    size: f.size,
                  }))
                  setAttachments((prev) => [...next, ...prev])
                  e.currentTarget.value = ''
                }}
              />

              {attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có tệp nào. Hãy chọn tệp để tải lên.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                  {attachments.map((f) => (
                    <div key={f.id} className="relative border rounded-md p-2 group">
                      <button
                        className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== f.id))}
                        aria-label="Xóa"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {f.type.startsWith('image/') ? (
                        <img src={f.url} alt={f.name} className="h-24 w-full object-cover rounded" />
                      ) : (
                        <div className="h-24 w-full flex items-center justify-center bg-muted rounded">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="mt-1 text-xs line-clamp-2" title={f.name}>{f.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


