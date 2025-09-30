"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { teamApi, Team } from "@/lib/team-api"
import { toast } from "sonner"

interface EditTeamDialogProps {
  team: Team
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: (updated: Team) => void
}

export function EditTeamDialog({ team, open, onOpenChange, onUpdated }: EditTeamDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [visibility, setVisibility] = useState<"public" | "private">("private")
  const [allowSelfJoin, setAllowSelfJoin] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!team) return
    setName(team.name || "")
    setDescription(team.description || "")
    setAvatarUrl(team.avatarUrl || "")
    setVisibility(team.settings?.visibility || "private")
    setAllowSelfJoin(Boolean(team.settings?.allowSelfJoin))
  }, [team])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await teamApi.updateTeam(team._id, {
        name,
        description,
        avatarUrl,
        settings: { visibility, allowSelfJoin },
      })
      toast.success("Cập nhật nhóm thành công")
      onUpdated(updated)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Update team error:", error)
      toast.error(error.message || "Không thể cập nhật nhóm")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin nhóm</DialogTitle>
          <DialogDescription>Cập nhật thông tin cho nhóm của bạn.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên nhóm</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="avatarUrl">URL Avatar (tùy chọn)</Label>
              <Input id="avatarUrl" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Hiển thị</Label>
                <Select value={visibility} onValueChange={(v: "public" | "private") => setVisibility(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Riêng tư</SelectItem>
                    <SelectItem value="public">Công khai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch id="allowSelfJoin" checked={allowSelfJoin} onCheckedChange={setAllowSelfJoin} />
                <Label htmlFor="allowSelfJoin">Cho phép tự tham gia</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


