import { NotificationModel, INotification } from '../models/notification.model'
import { UserModel } from '../models/user.model'
import ErrorHandler from '../utils/ErrorHandler'
import { CatchAsyncError } from '../middleware/CatchAsyncError'

export interface CreateNotificationData {
  recipientId: string
  senderId?: string
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention'
  title: string
  message: string
  data?: {
    taskId?: string
    teamId?: string
    projectId?: string
    [key: string]: any
  }
}

export interface NotificationFilters {
  recipientId: string
  type?: string
  isRead?: boolean
  limit?: number
  page?: number
}

// Tạo thông báo mới
export const createNotification = async (data: CreateNotificationData) => {
  const { recipientId, senderId, type, title, message, data: notificationData } = data

  // Kiểm tra người nhận có tồn tại không
  const recipient = await UserModel.findById(recipientId)
  if (!recipient) {
    throw new ErrorHandler('Người nhận thông báo không tồn tại', 404)
  }

  // Kiểm tra người gửi nếu có
  if (senderId) {
    const sender = await UserModel.findById(senderId)
    if (!sender) {
      throw new ErrorHandler('Người gửi thông báo không tồn tại', 404)
    }
  }

  const notification = await NotificationModel.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    data: notificationData || {},
  })

  return notification
}

// Lấy danh sách thông báo của user
export const getNotifications = async (filters: NotificationFilters) => {
  const { recipientId, type, isRead, limit = 20, page = 1 } = filters

  const query: any = { recipient: recipientId }

  if (type) {
    query.type = type
  }

  if (isRead !== undefined) {
    query.isRead = isRead
  }

  const skip = (page - 1) * limit

  const notifications = await NotificationModel.find(query)
    .populate('sender', 'name email avatarUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await NotificationModel.countDocuments(query)

  return {
    notifications,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total,
    },
  }
}

// Đánh dấu thông báo đã đọc
export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await NotificationModel.findOne({
    _id: notificationId,
    recipient: userId,
  })

  if (!notification) {
    throw new ErrorHandler('Thông báo không tồn tại', 404)
  }

  notification.isRead = true
  notification.readAt = new Date()
  await notification.save()

  return notification
}

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (userId: string) => {
  const result = await NotificationModel.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  )

  return result
}

// Xóa thông báo
export const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await NotificationModel.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  })

  if (!notification) {
    throw new ErrorHandler('Thông báo không tồn tại', 404)
  }

  return notification
}

// Đếm số thông báo chưa đọc
export const getUnreadCount = async (userId: string) => {
  const count = await NotificationModel.countDocuments({
    recipient: userId,
    isRead: false,
  })

  return count
}

// Tạo thông báo cho nhiều người (broadcast)
export const createBroadcastNotification = async (
  recipientIds: string[],
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention',
  title: string,
  message: string,
  senderId?: string,
  data?: any
) => {
  const notifications = recipientIds.map(recipientId => ({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    data: data || {},
  }))

  const createdNotifications = await NotificationModel.insertMany(notifications)
  return createdNotifications
}

// Tạo thông báo cho team
export const createTeamNotification = async (
  teamId: string,
  type: 'task_assigned' | 'task_completed' | 'task_updated' | 'team_invite' | 'system' | 'mention',
  title: string,
  message: string,
  senderId?: string,
  data?: any
) => {
  // TODO: Lấy danh sách thành viên team từ Team model
  // Hiện tại tạm thời return empty array
  // const teamMembers = await TeamModel.findById(teamId).select('members')
  // const recipientIds = teamMembers?.members || []

  // Tạm thời return empty array cho đến khi có Team model
  return []
}