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
import { UserPlus } from "lucide-react"
import { teamApi, InviteMemberData, Team } from "@/lib/team-api"
import { toast } from "sonner"

interface InviteMemberDialogProps {
  team: Team
  onMemberInvited?: () => void
}

export function InviteMemberDialog({ team, onMemberInvited }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<InviteMemberData>({
    inviteeEmail: "",
    role: "member",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.inviteeEmail.trim()) {
      toast.error("Email là bắt buộc")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.inviteeEmail)) {
      toast.error("Email không hợp lệ")
      return
    }

    setLoading(true)
    try {
      const teamId = (team as any)?._id || (team as any)?.id
      if (!teamId) {
        throw new Error('Thiếu teamId')
      }
      await teamApi.inviteMember(teamId, formData)
      toast.success("Lời mời đã được gửi!")
      setOpen(false)
      setFormData({
        inviteeEmail: "",
        role: "member",
        message: ""
      })
      onMemberInvited?.()
    } catch (error: any) {
      console.log(error)
      const message =
        error?.response?.data?.message ||
        error?.response?.message ||
        error?.message ||
        "Có lỗi xảy ra khi gửi lời mời"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Mời thành viên
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mời thành viên vào nhóm</DialogTitle>
          <DialogDescription>
            Mời người dùng tham gia nhóm "{team.name}" bằng email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email người được mời *</Label>
              <Input
                id="email"
                type="email"
                value={formData.inviteeEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, inviteeEmail: e.target.value }))}
                placeholder="user@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "member") =>
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Thành viên</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Viết lời nhắn cho người được mời..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi lời mời"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
