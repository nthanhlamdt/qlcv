import { Request, Response, NextFunction } from 'express'
import { CatchAsyncError } from '../middleware/CatchAsyncError'
import { socketService } from '../server'
import { createNotification } from '../services/notification.service'

// Gửi thông báo realtime đến user cụ thể
export const sendRealtimeNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { recipientId, type, title, message, data } = req.body
  const senderId = req.user?.id

  if (!recipientId || !type || !title || !message) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  try {
    const notification = await socketService.createAndSendNotification(
      recipientId,
      type,
      title,
      message,
      senderId,
      data
    )

    res.status(200).json({
      success: true,
      message: 'Thông báo đã được gửi thành công',
      data: notification,
    })
  } catch (error) {
    next(error)
  }
})

// Gửi thông báo broadcast đến nhiều users
export const sendBroadcastNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { recipientIds, type, title, message, data } = req.body
  const senderId = req.user?.id

  if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
    return next(new Error('Danh sách người nhận không hợp lệ'))
  }

  if (!type || !title || !message) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  try {
    const notifications = await socketService.createAndSendBroadcastNotification(
      recipientIds,
      type,
      title,
      message,
      senderId,
      data
    )

    res.status(200).json({
      success: true,
      message: `Thông báo đã được gửi đến ${notifications.length} người`,
      data: notifications,
    })
  } catch (error) {
    next(error)
  }
})

// Gửi thông báo đến room (team, project)
export const sendRoomNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { roomId, type, title, message, data } = req.body
  const senderId = req.user?.id

  if (!roomId || !type || !title || !message) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  try {
    // Tạo thông báo trong database (có thể cần lấy danh sách members của room)
    const notification = await createNotification({
      recipientId: 'system', // Tạm thời
      senderId,
      type,
      title,
      message,
      data: { ...data, roomId },
    })

    // Gửi thông báo realtime đến room
    socketService.sendNotificationToRoom(roomId, notification)

    res.status(200).json({
      success: true,
      message: 'Thông báo đã được gửi đến room',
      data: notification,
    })
  } catch (error) {
    next(error)
  }
})

// Lấy danh sách users đang online
export const getOnlineUsers = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const onlineUsers = socketService.getOnlineUsers()

  res.status(200).json({
    success: true,
    data: {
      onlineUsers,
      count: onlineUsers.length,
    },
  })
})

// Kiểm tra user có online không
export const checkUserOnline = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  if (!userId) {
    return next(new Error('User ID không tồn tại'))
  }

  const isOnline = socketService.isUserOnline(userId)

  res.status(200).json({
    success: true,
    data: {
      userId,
      isOnline,
    },
  })
})

// Gửi thông báo task assigned
export const sendTaskAssignedNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId, assigneeId, taskTitle } = req.body
  const assignerId = req.user?.id

  if (!taskId || !assigneeId || !taskTitle) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  try {
    const notification = await socketService.createAndSendNotification(
      assigneeId,
      'task_assigned',
      'Công việc mới được giao',
      `Bạn đã được giao công việc: ${taskTitle}`,
      assignerId,
      { taskId }
    )

    res.status(200).json({
      success: true,
      message: 'Thông báo giao việc đã được gửi',
      data: notification,
    })
  } catch (error) {
    next(error)
  }
})

// Gửi thông báo task completed
export const sendTaskCompletedNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { taskId, taskTitle, teamMembers } = req.body
  const completerId = req.user?.id

  if (!taskId || !taskTitle || !teamMembers || !Array.isArray(teamMembers)) {
    return next(new Error('Thiếu thông tin bắt buộc'))
  }

  try {
    const notifications = await socketService.createAndSendBroadcastNotification(
      teamMembers,
      'task_completed',
      'Công việc đã hoàn thành',
      `Công việc "${taskTitle}" đã được hoàn thành`,
      completerId,
      { taskId }
    )

    res.status(200).json({
      success: true,
      message: `Thông báo hoàn thành công việc đã được gửi đến ${notifications.length} thành viên`,
      data: notifications,
    })
  } catch (error) {
    next(error)
  }
})
