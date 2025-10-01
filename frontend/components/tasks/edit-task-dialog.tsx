"use client"
import { useEffect, useMemo, useState } from "react"
import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Task {
  id: number | string
  title?: string
  description?: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignee?: string
  dueDate?: string
  tags: string[]
}

interface EditTaskDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: any) => void
}

export function EditTaskDialog({ task, open, onOpenChange, onSave }: EditTaskDialogProps) {
  const [formData, setFormData] = useState<Task>({
    id: 0,
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    tags: [],
  })
  const [newTag, setNewTag] = useState("")

  // Convert displayed date to input[type=date] value
  const formatDateForInput = (value?: string) => {
    if (!value) return ""
    // cases: dd/MM/yyyy or yyyy-MM-dd or ISO
    if (value.includes("/")) {
      const [d, m, y] = value.split("/")
      if (d && m && y) return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
    }
    if (value.includes("T")) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        return `${date.getFullYear()}-${mm}-${dd}`
      }
    }
    return value
  }

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title || "",
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: formatDateForInput(task.dueDate),
        tags: task.tags || [],
      })
    }
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: any = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      tags: formData.tags,
    }
    if (formData.assignee !== undefined) payload.assignee = formData.assignee
    if (formData.dueDate) payload.dueDate = new Date(formData.dueDate).toISOString()
    onSave(payload)
    onOpenChange(false)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{task ? "Chỉnh sửa công việc" : "Tạo công việc mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Nhập tiêu đề công việc"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả công việc"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "pending" | "in-progress" | "completed") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Cao</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="low">Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.assignee !== undefined && (
            <div className="space-y-2">
              <Label htmlFor="assignee">Người thực hiện</Label>
              <Input
                id="assignee"
                value={formData.assignee || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, assignee: e.target.value }))}
                placeholder="Nhập tên người thực hiện"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dueDate">Hạn chót</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Thêm tag"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Thêm
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">{task ? "Cập nhật" : "Tạo mới"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
