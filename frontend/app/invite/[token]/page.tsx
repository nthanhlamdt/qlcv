"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { teamApi, TeamInvite } from "@/lib/team-api"
import { toast } from "sonner"
import { CheckCircle, XCircle, Clock, Users, Shield } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useAuth } from "@/contexts/AuthContext"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const token = params.token as string

  const [invite, setInvite] = useState<TeamInvite | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const loadInvite = async () => {
    try {
      setLoading(true)
      const inviteData = await teamApi.getInviteByToken(token)
      setInvite(inviteData)
    } catch (error: any) {
      console.error("Error loading invite:", error)
      toast.error("Lời mời không hợp lệ hoặc đã hết hạn")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadInvite()
    }
  }, [token])

  const handleAccept = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để chấp nhận lời mời")
      router.push("/auth/login")
      return
    }

    try {
      setProcessing(true)
      await teamApi.acceptInvite(token)
      toast.success("Đã chấp nhận lời mời tham gia nhóm!")
      router.push("/teams")
    } catch (error: any) {
      console.error("Error accepting invite:", error)
      toast.error(error.response?.data?.message || "Không thể chấp nhận lời mời")
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để từ chối lời mời")
      router.push("/auth/login")
      return
    }

    try {
      setProcessing(true)
      await teamApi.rejectInvite(token)
      toast.success("Đã từ chối lời mời")
      router.push("/teams")
    } catch (error: any) {
      console.error("Error rejecting invite:", error)
      toast.error(error.response?.data?.message || "Không thể từ chối lời mời")
    } finally {
      setProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'expired':
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ phản hồi'
      case 'accepted':
        return 'Đã chấp nhận'
      case 'rejected':
        return 'Đã từ chối'
      case 'expired':
        return 'Đã hết hạn'
      default:
        return 'Chờ phản hồi'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'member':
        return 'Thành viên'
      default:
        return 'Thành viên'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 bg-muted animate-pulse rounded mx-auto mb-4" />
          <p>Đang tải thông tin lời mời...</p>
        </div>
      </div>
    )
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Lời mời không hợp lệ</h3>
            <p className="text-muted-foreground mb-4">
              Lời mời này không tồn tại hoặc đã hết hạn.
            </p>
            <Button onClick={() => router.push("/teams")}>
              Quay lại trang nhóm
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = new Date(invite.expiresAt) < new Date()
  const canRespond = invite.status === 'pending' && !isExpired && user

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon(invite.status)}
          </div>
          <CardTitle className="text-2xl">Lời mời tham gia nhóm</CardTitle>
          <CardDescription>
            Bạn được mời tham gia nhóm "{invite.team.name}"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Team Info */}
          <div className="text-center">
            <Avatar className="h-16 w-16 mx-auto mb-4">
              <AvatarImage src={invite.team.avatarUrl} alt={invite.team.name} />
              <AvatarFallback className="text-lg">
                {invite.team.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-2">{invite.team.name}</h3>
            {invite.team.description && (
              <p className="text-muted-foreground mb-4">{invite.team.description}</p>
            )}
          </div>

          {/* Invite Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Người mời:</span>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={invite.inviter.avatarUrl} alt={invite.inviter.name} />
                  <AvatarFallback className="text-xs">
                    {invite.inviter.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{invite.inviter.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vai trò:</span>
              <Badge variant="outline">{getRoleLabel(invite.role)}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Trạng thái:</span>
              <Badge variant={invite.status === 'pending' ? 'default' : 'secondary'}>
                {getStatusLabel(invite.status)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hết hạn:</span>
              <span className="text-sm">
                {formatDistanceToNow(new Date(invite.expiresAt), {
                  addSuffix: true,
                  locale: vi
                })}
              </span>
            </div>

            {invite.message && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Lời nhắn:</p>
                <p className="text-sm">{invite.message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {!user ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Bạn cần đăng nhập để chấp nhận lời mời này
              </p>
              <div className="flex space-x-2 justify-center">
                <Button onClick={() => router.push("/auth/login")}>
                  Đăng nhập
                </Button>
                <Button variant="outline" onClick={() => router.push("/auth/register")}>
                  Đăng ký
                </Button>
              </div>
            </div>
          ) : canRespond ? (
            <div className="flex space-x-2 justify-center">
              <Button
                onClick={handleAccept}
                disabled={processing}
                className="flex-1"
              >
                {processing ? "Đang xử lý..." : "Chấp nhận"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={processing}
                className="flex-1"
              >
                Từ chối
              </Button>
            </div>
          ) : invite.status === 'accepted' ? (
            <div className="text-center">
              <p className="text-sm text-green-600 mb-2">
                Bạn đã chấp nhận lời mời này
              </p>
              <Button onClick={() => router.push("/teams")}>
                Xem nhóm
              </Button>
            </div>
          ) : invite.status === 'rejected' ? (
            <div className="text-center">
              <p className="text-sm text-red-600 mb-2">
                Bạn đã từ chối lời mời này
              </p>
              <Button variant="outline" onClick={() => router.push("/teams")}>
                Quay lại trang nhóm
              </Button>
            </div>
          ) : isExpired ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Lời mời này đã hết hạn
              </p>
              <Button variant="outline" onClick={() => router.push("/teams")}>
                Quay lại trang nhóm
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
