"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import { teamApi, CreateTeamData } from "@/lib/team-api"
import { toast } from "sonner"

interface CreateTeamDialogProps {
  onTeamCreated?: (team: any) => void
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateTeamData>({
    name: "",
    description: "",
    avatarUrl: "",
    settings: {
      visibility: "private",
      allowSelfJoin: false
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Tên nhóm là bắt buộc")
      return
    }

    setLoading(true)
    try {
      const team = await teamApi.createTeam(formData)
      toast.success("Tạo nhóm thành công!")
      setOpen(false)
      setFormData({
        name: "",
        description: "",
        avatarUrl: "",
        settings: {
          visibility: "private",
          allowSelfJoin: false
        }
      })
      onTeamCreated?.(team)
    } catch (error: any) {
      console.error("Error creating team:", error)
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi tạo nhóm")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tạo nhóm mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo nhóm mới</DialogTitle>
          <DialogDescription>
            Tạo một nhóm mới để quản lý công việc và cộng tác với đồng nghiệp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên nhóm *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nhập tên nhóm..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả về nhóm..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">URL Avatar (tùy chọn)</Label>
              <Input
                id="avatarUrl"
                value={formData.avatarUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Quyền riêng tư</Label>
                  <p className="text-sm text-muted-foreground">
                    Chọn ai có thể xem nhóm này
                  </p>
                </div>
                <Select
                  value={formData.settings?.visibility}
                  onValueChange={(value: "public" | "private") =>
                    setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings!, visibility: value }
                    }))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Riêng tư</SelectItem>
                    <SelectItem value="public">Công khai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép tự tham gia</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác tự tham gia nhóm
                  </p>
                </div>
                <Switch
                  checked={formData.settings?.allowSelfJoin}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings!, allowSelfJoin: checked }
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang tạo..." : "Tạo nhóm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
