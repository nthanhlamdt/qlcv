import { Router } from 'express'
import { isAuthenticated } from '../middleware/auth'
import {
  getUserNotifications,
  createNewNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
  getUnreadNotificationCount,
  createBroadcast,
  getNotificationById,
} from '../controllers/notification.controllers'

const router = Router()

// Tất cả routes đều cần xác thực
router.use(isAuthenticated)

// GET /api/notifications - Lấy danh sách thông báo của user
router.get('/', getUserNotifications)

// GET /api/notifications/unread-count - Lấy số thông báo chưa đọc
router.get('/unread-count', getUnreadNotificationCount)

// GET /api/notifications/:notificationId - Lấy thông báo theo ID
router.get('/:notificationId', getNotificationById)

// POST /api/notifications - Tạo thông báo mới
router.post('/', createNewNotification)

// POST /api/notifications/broadcast - Tạo thông báo broadcast
router.post('/broadcast', createBroadcast)

// PATCH /api/notifications/:notificationId/read - Đánh dấu thông báo đã đọc
router.patch('/:notificationId/read', markNotificationAsRead)

// PATCH /api/notifications/mark-all-read - Đánh dấu tất cả thông báo đã đọc
router.patch('/mark-all-read', markAllNotificationsAsRead)

// DELETE /api/notifications/:notificationId - Xóa thông báo
router.delete('/:notificationId', deleteUserNotification)

export default router
