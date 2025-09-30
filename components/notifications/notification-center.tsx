"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Check, CheckCheck, Trash2, MoreHorizontal } from "lucide-react"
import { notificationApi, Notification } from "@/lib/notification-api"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { toast } from "sonner"
import { useSocket } from "@/hooks/use-socket"

interface NotificationCenterProps {
  onNotificationClick?: (notification: Notification) => void
}

export function NotificationCenter({ onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const { socket } = useSocket()

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const [notificationsData, unreadCountData] = await Promise.all([
        notificationApi.getNotifications({ limit: 20 }),
        notificationApi.getUnreadCount()
      ])
      setNotifications(notificationsData)
      setUnreadCount(unreadCountData)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()

    // Listen for new notifications via Socket.IO
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)
      toast.info(notification.title, {
        description: notification.message
      })
    }

    socket.on('new_notification', handleNewNotification)

    return () => {
      socket.off('new_notification', handleNewNotification)
    }
  }, [socket])

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return

    try {
      await notificationApi.markAsRead(notification._id)
      setNotifications(prev =>
        prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Không thể đánh dấu thông báo đã đọc")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
      toast.success("Đã đánh dấu tất cả thông báo đã đọc")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc")
    }
  }

  const handleDeleteNotification = async (notification: Notification) => {
    try {
      await notificationApi.deleteNotification(notification._id)
      setNotifications(prev => prev.filter(n => n._id !== notification._id))
      if (!notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Không thể xóa thông báo")
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'team_invite':
        return '👥'
      case 'team_join':
        return '✅'
      case 'task_assigned':
        return '📋'
      case 'task_completed':
        return '🎉'
      case 'task_updated':
        return '📝'
      case 'mention':
        return '💬'
      case 'comment':
        return '💭'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'team_invite':
        return 'text-blue-600'
      case 'team_join':
        return 'text-green-600'
      case 'task_assigned':
        return 'text-orange-600'
      case 'task_completed':
        return 'text-green-600'
      case 'task_updated':
        return 'text-yellow-600'
      case 'mention':
        return 'text-purple-600'
      case 'comment':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuHeader className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Thông báo</h4>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-8 px-2"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
          )}
        </DropdownMenuHeader>
        <Separator />
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Đang tải thông báo...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}
                  onClick={() => {
                    if (!notification.isRead) {
                      handleMarkAsRead(notification)
                    }
                    onNotificationClick?.(notification)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`text-lg ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-medium truncate">
                          {notification.title}
                        </h5>
                        <div className="flex items-center space-x-1">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteNotification(notification)
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
