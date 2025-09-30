import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/CatchAsyncError'
import { NotificationModel } from '../models/notification.model'
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createBroadcastNotification,
  CreateNotificationData,
  NotificationFilters,
} from '../services/notification.service'

// Lấy danh sách thông báo của user
export const getUserNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id
  const { type, isRead, limit = 20, page = 1 } = req.query

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const filters: NotificationFilters = {
    recipientId: userId,
    type: type as string,
    isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    limit: parseInt(limit as string),
    page: parseInt(page as string),
  }

  const result = await getNotifications(filters)

  res.status(200).json({
    success: true,
    data: result,
  })
})

// Tạo thông báo mới
export const createNewNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { recipientId, type, title, message, data } = req.body
  const senderId = req.user?.id

  const notificationData: CreateNotificationData = {
    recipientId,
    senderId,
    type,
    title,
    message,
    data,
  }

  const notification = await createNotification(notificationData)

  res.status(201).json({
    success: true,
    data: notification,
  })
})

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const notification = await markAsRead(notificationId, userId)

  res.status(200).json({
    success: true,
    data: notification,
  })
})

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const result = await markAllAsRead(userId)

  res.status(200).json({
    success: true,
    message: 'Đã đánh dấu tất cả thông báo là đã đọc',
    data: result,
  })
})

// Xóa thông báo
export const deleteUserNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const notification = await deleteNotification(notificationId, userId)

  res.status(200).json({
    success: true,
    message: 'Đã xóa thông báo',
    data: notification,
  })
})

// Lấy số thông báo chưa đọc
export const getUnreadNotificationCount = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const count = await getUnreadCount(userId)

  res.status(200).json({
    success: true,
    data: { unreadCount: count },
  })
})

// Tạo thông báo broadcast (cho admin hoặc system)
export const createBroadcast = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { recipientIds, type, title, message, data } = req.body
  const senderId = req.user?.id

  if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
    return next(new Error('Danh sách người nhận không hợp lệ'))
  }

  const notifications = await createBroadcastNotification(
    recipientIds,
    type,
    title,
    message,
    senderId,
    data
  )

  res.status(201).json({
    success: true,
    message: `Đã gửi thông báo đến ${notifications.length} người`,
    data: notifications,
  })
})

// Lấy thông báo theo ID
export const getNotificationById = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { notificationId } = req.params
  const userId = req.user?.id

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const notification = await NotificationModel.findOne({
    _id: notificationId,
    recipient: userId,
  }).populate('sender', 'name email avatarUrl')

  if (!notification) {
    return next(new Error('Thông báo không tồn tại'))
  }

  res.status(200).json({
    success: true,
    data: notification,
  })
})
