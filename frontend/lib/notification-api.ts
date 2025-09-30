import { getJson, postJson, patchJson, deleteJson } from './api'

export interface Notification {
  _id: string
  recipient: string
  sender?: {
    _id: string
    name: string
    email: string
    avatarUrl?: string
  }
  type: 'system' | 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'team_join' | 'mention' | 'comment'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationFilters {
  type?: Notification['type']
  isRead?: boolean
  limit?: number
  page?: number
}

// Notification API functions
export const notificationApi = {
  // Lấy danh sách thông báo của user
  getNotifications: async (filters?: NotificationFilters): Promise<Notification[]> => {
    const params = new URLSearchParams()
    if (filters?.type) params.append('type', filters.type)
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.page) params.append('page', filters.page.toString())

    const response = await getJson(`/notifications?${params.toString()}`)
    // Tolerant parsing across possible response shapes
    if (response?.data?.notifications) return response.data.notifications
    if (Array.isArray(response?.notifications)) return response.notifications
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response)) return response
    return []
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId: string): Promise<void> => {
    await patchJson(`/notifications/${notificationId}/read`, {})
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async (): Promise<void> => {
    await patchJson('/notifications/mark-all-read', {})
  },

  // Xóa thông báo
  deleteNotification: async (notificationId: string): Promise<void> => {
    await deleteJson(`/notifications/${notificationId}`)
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async (): Promise<number> => {
    const response = await getJson('/notifications/unread-count')
    return (
      response?.data?.unreadCount ??
      response?.unreadCount ??
      response?.count ??
      0
    )
  },

  // Tạo thông báo mới (cho admin/system)
  createNotification: async (data: {
    recipient: string
    sender?: string
    type: Notification['type']
    title: string
    message: string
    data?: Record<string, any>
  }): Promise<Notification> => {
    const response = await postJson('/notifications', data)
    return response.notification
  },

  // Tạo thông báo broadcast (gửi đến nhiều người)
  createBroadcastNotification: async (
    recipients: string[],
    type: Notification['type'],
    title: string,
    message: string,
    sender?: string,
    data?: Record<string, any>
  ): Promise<Notification[]> => {
    const response = await postJson('/notifications/broadcast', {
      recipients,
      type,
      title,
      message,
      sender,
      data
    })
    return response.notifications
  }
}
