"use client"

import React, { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { teamApi, CreateTeamData, Team } from "@/lib/team-api"
import { toast } from "sonner"

interface CreateTeamDialogProps {
  onCreateTeam: (newTeam: Team) => void
}

export function CreateTeamDialog({ onCreateTeam }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("private")
  const [allowSelfJoin, setAllowSelfJoin] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const newTeamData: CreateTeamData = {
        name,
        description,
        avatarUrl,
        settings: {
          visibility,
          allowSelfJoin,
        },
      }
      const newTeam = await teamApi.createTeam(newTeamData)
      onCreateTeam(newTeam)
      toast.success("Nhóm đã được tạo thành công!")
      setOpen(false)
      // Reset form
      setName("")
      setDescription("")
      setAvatarUrl("")
      setVisibility("private")
      setAllowSelfJoin(false)
    } catch (error: any) {
      console.error("Error creating team:", error)
      toast.error(error.message || "Không thể tạo nhóm")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="mr-2 h-4 w-4" />
          Tạo nhóm mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo nhóm mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo nhóm mới cho dự án của bạn.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên nhóm</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên nhóm..."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về nhóm..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">URL Avatar (tùy chọn)</Label>
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Hiển thị</Label>
                <Select value={visibility} onValueChange={(value: "public" | "private") => setVisibility(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chế độ hiển thị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Riêng tư (Chỉ thành viên)</SelectItem>
                    <SelectItem value="public">Công khai (Mọi người có thể xem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="allowSelfJoin"
                  checked={allowSelfJoin}
                  onCheckedChange={setAllowSelfJoin}
                />
                <Label htmlFor="allowSelfJoin">Cho phép tự tham gia</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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