import { api } from './api'

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

    const response = await api.get(`/notifications?${params.toString()}`)
    return response.data.data
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/notifications/${notificationId}/read`)
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/mark-all-read')
  },

  // Xóa thông báo
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`)
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count')
    return response.data.count
  }
}
