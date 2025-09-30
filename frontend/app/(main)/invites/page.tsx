"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { teamApi, TeamInvite } from "@/lib/team-api"
import { toast } from "sonner"
import { Check, X, Users, Clock, Mail } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"

export default function InvitesPage() {
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const router = useRouter()

  const loadInvites = async () => {
    try {
      setLoading(true)
      const data = await teamApi.getMyInvites()
      setInvites(data)
    } catch (error: any) {
      console.error("Error loading invites:", error)
      toast.error(error.message || "Không thể tải danh sách lời mời")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvites()
  }, [])

  const handleAcceptInvite = async (invite: TeamInvite) => {
    setProcessing(invite._id)
    try {
      await teamApi.acceptInvite(invite.token)
      toast.success("Đã chấp nhận lời mời tham gia nhóm!")
      setInvites(prev => prev.filter(inv => inv._id !== invite._id))
      // Redirect to team page
      router.push(`/teams/${invite.team._id}`)
    } catch (error: any) {
      console.error("Error accepting invite:", error)
      toast.error(error.message || "Không thể chấp nhận lời mời")
    } finally {
      setProcessing(null)
    }
  }

  const handleRejectInvite = async (invite: TeamInvite) => {
    setProcessing(invite._id)
    try {
      await teamApi.rejectInvite(invite.token)
      toast.success("Đã từ chối lời mời")
      setInvites(prev => prev.filter(inv => inv._id !== invite._id))
    } catch (error: any) {
      console.error("Error rejecting invite:", error)
      toast.error(error.message || "Không thể từ chối lời mời")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Chờ phản hồi</Badge>
      case 'accepted':
        return <Badge variant="default" className="bg-green-600">Đã chấp nhận</Badge>
      case 'rejected':
        return <Badge variant="destructive">Đã từ chối</Badge>
      case 'expired':
        return <Badge variant="secondary">Đã hết hạn</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lời mời tham gia nhóm</h1>
          <p className="text-muted-foreground">Quản lý các lời mời tham gia nhóm</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Lời mời tham gia nhóm</h1>
        <p className="text-muted-foreground">Quản lý các lời mời tham gia nhóm</p>
      </div>

      {invites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có lời mời nào</h3>
            <p className="text-muted-foreground text-center">
              Bạn chưa nhận được lời mời tham gia nhóm nào.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <Card key={invite._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{invite.team.name}</CardTitle>
                    <CardDescription>
                      Lời mời từ <strong>{invite.inviter.name}</strong>
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(invite.status)}
                    {isExpired(invite.expiresAt) && (
                      <Badge variant="destructive">Hết hạn</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {invite.team.description && (
                  <p className="text-sm text-muted-foreground">
                    {invite.team.description}
                  </p>
                )}

                {invite.message && (
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Lời nhắn:</strong> {invite.message}
                    </p>
                  </div>
                )}

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>Vai trò: {invite.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Hết hạn: {formatDistanceToNow(new Date(invite.expiresAt), {
                        addSuffix: true,
                        locale: vi
                      })}
                    </span>
                  </div>
                </div>

                <Separator />

                {invite.status === 'pending' && !isExpired(invite.expiresAt) && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleAcceptInvite(invite)}
                      disabled={processing === invite._id}
                      className="flex-1"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {processing === invite._id ? "Đang xử lý..." : "Chấp nhận"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRejectInvite(invite)}
                      disabled={processing === invite._id}
                      className="flex-1"
                    >
                      <X className="mr-2 h-4 w-4" />
                      {processing === invite._id ? "Đang xử lý..." : "Từ chối"}
                    </Button>
                  </div>
                )}

                {invite.status === 'accepted' && (
                  <div className="text-center">
                    <Button
                      onClick={() => router.push(`/teams/${invite.team._id}`)}
                      className="w-full"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Xem nhóm
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}